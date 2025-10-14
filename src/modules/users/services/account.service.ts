import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EmailsService } from 'src/modules/emails/emails.service';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { User } from '../entities/user.entity';
import { UtilsService } from './utils.service';
import { TokenService } from 'src/modules/token/token.service';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly emailService: EmailsService,
    private readonly utilsService: UtilsService,
    private readonly tokenService: TokenService,
  ) {}

  async getProfile(email: string) {
    const user = await this.utilsService.findByEmailUtil(email.toLowerCase());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      twoFA: user.twoFA,
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto, email: string) {
    const user = await this.utilsService.findByEmailUtil(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatching = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordMatching) {
      // Registrar tentativa de alteração de senha com senha inválida
      this.logger.warn(`Failed password change attempt for user: ${email}`);
      throw new BadRequestException('Invalid password');
    }

    // Verificar se a nova senha é igual à antiga
    const isSamePassword = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date(); // Adicionar timestamp da alteração
    await this.usersRepository.save(user);

    // Enviar notificação de alteração de senha
    await this.emailService.queueEmail(
      user.email,
      'Password Changed - Cooperescrita',
      `<p>Your password was changed on ${new Date().toLocaleString()}.</p>
      <p>If you did not make this change, please contact support immediately.</p>`,
      { priority: 'high' },
    );

    this.logger.log(`Password changed successfully for user: ${email}`);
    return { message: 'Password changed successfully' };
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, email: string) {
    const user = await this.utilsService.findByEmailUtil(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Atualizar apenas os campos fornecidos
    if (updateProfileDto.name) {
      user.name = updateProfileDto.name;
    }

    await this.usersRepository.save(user);

    this.logger.log(`Profile updated for user: ${email}`);
    return {
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async activateTwoFA(email: string) {
    const user = await this.utilsService.findByEmailUtil(email.toLowerCase());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.twoFA) {
      throw new ConflictException('Two-factor authentication already enabled');
    }

    user.twoFA = true;
    await this.usersRepository.save(user);

    // Enviar notificação de segurança
    await this.emailService.queueEmail(
      user.email,
      'Security Update - 2FA Enabled',
      `<p>Two-factor authentication has been enabled for your account.</p>
      <p>Your account is now more secure. If you did not make this change, please contact support immediately.</p>`,
      { priority: 'high' },
    );

    this.logger.log(`Two-factor authentication activated for user: ${email}`);
    return { message: 'Two-factor authentication activated' };
  }

  async desactivateTwoFA(email: string) {
    const user = await this.utilsService.findByEmailUtil(email.toLowerCase());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'admin') {
      this.logger.warn(`Attempt to disable 2FA for admin account: ${email}`);
      throw new ForbiddenException(
        'Cannot disable two-factor authentication for admins',
      );
    }

    if (!user.twoFA) {
      throw new ConflictException('Two-factor authentication already disabled');
    }

    user.twoFA = false;
    await this.usersRepository.save(user);

    // Enviar alerta de segurança
    await this.emailService.queueEmail(
      user.email,
      'Security Alert - 2FA Disabled',
      `<p>Two-factor authentication has been disabled for your account.</p>
      <p>Your account is now less secure. If you did not make this change, please contact support immediately.</p>`,
      { priority: 'high' },
    );

    this.logger.log(`Two-factor authentication disabled for user: ${email}`);
    return { message: 'Two-factor authentication disabled' };
  }

  async deleteAccount(email: string) {
    const user = await this.utilsService.findByEmailUtil(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email === process.env.MAIN_ADMIN) {
      const report = `Houve uma tentativa de remoção do usuário ${user.email}`;
      await this.emailService.sendReportAlertAdmin(report);

      this.logger.warn(`Attempt to delete main admin account: ${email}`);
      throw new ForbiddenException(
        'Cannot delete main admin, a security alert has been sent to the main admin',
      );
    }

    await this.tokenService.revokeAllUserTokens(user.id);

    // Implementar soft delete em vez de exclusão permanente
    user.active = false;
    user.deactivatedAt = new Date();
    // Anonimizar dados pessoais mantendo referências intactas
    const anonymizedEmail = `deleted-${Date.now()}-${user.id}@anonymous.com`;
    user.email = anonymizedEmail;

    await this.usersRepository.save(user);

    // Enviar confirmação de exclusão
    await this.emailService.queueEmail(
      email, // Usar email original para notificação
      'Account Deleted - Cooperescrita',
      `<p>Your account has been deleted as requested.</p>
      <p>We're sorry to see you go. If you wish to return, you'll need to create a new account.</p>`,
    );

    this.logger.log(`Account soft-deleted for user: ${email}`);
    return { message: 'Account deleted successfully' };
  }
}
