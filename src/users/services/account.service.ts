import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EmailsService } from 'src/emails/emails.service';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { User } from '../entities/user.entity';
import { UtilsService } from './utils.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly emailService: EmailsService,
    private readonly utilsService: UtilsService,
  ) {}

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
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;
    await this.usersRepository.save(user);

    return { message: 'Password changed successfully' };
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

    return { message: 'Two-factor authentication activated' };
  }

  async desactivateTwoFA(email: string) {
    const user = await this.utilsService.findByEmailUtil(email.toLowerCase());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'admin') {
      throw new ForbiddenException(
        'Cannot disable two-factor authentication for admins',
      );
    }

    if (!user.twoFA) {
      throw new ConflictException('Two-factor authentication already disabled');
    }

    user.twoFA = false;
    await this.usersRepository.save(user);

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

      throw new ForbiddenException(
        'Cannot delete main admin, a security alert has been sent to the main admin',
      );
    }

    await this.usersRepository.delete(user.id);

    return { message: 'Account deleted successfully' };
  }
}
