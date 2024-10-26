import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FindByEmailDto } from './dto/find-by-email.dto';
import { User } from './entities/user.entity';
import { FindByNameDto } from './dto/find-by-name.dto';
import * as dotenv from 'dotenv';
import { EmailsService } from 'src/emails/emails.service';
dotenv.config();

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly emailService: EmailsService,
  ) {}

  async findByEmailUtil(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(findByEmailDto: FindByEmailDto, sender: string) {
    const user = await this.findByEmailUtil(findByEmailDto.email);

    if (!user) {
      throw new ConflictException('User not found');
    }

    if (user.email === process.env.MAIN_ADMIN) {
      const report = `O usuário ${sender} tentou acessar o usuário ${user.email}`;
      await this.emailService.sendReportAlertAdmin(report);

      throw new ConflictException(
        'Cannot acess, a segurance alert has been sent to the main admin',
      );
    }

    return { ...user, password: undefined };
  }

  async findByName(findByNameDto: FindByNameDto, sender: string) {
    const user = await this.usersRepository.findOne({
      where: { name: findByNameDto.name },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    if (user.email === process.env.MAIN_ADMIN) {
      const report = `O usuário ${sender} tentou acessar o usuário ${user.email}`;
      await this.emailService.sendReportAlertAdmin(report);

      throw new ConflictException(
        'Cannot acess, a segurance alert has been sent to the main admin',
      );
    }

    return { ...user, password: undefined };
  }

  async deleteUserByEmail(findByEmailDto: FindByEmailDto, sender: string) {
    const user = await this.findByEmailUtil(findByEmailDto.email);

    if (user.email === process.env.MAIN_ADMIN) {
      const report = `O usuário ${sender} tentou DELETAR o usuário ${user.email}`;
      await this.emailService.sendReportAlertAdmin(report);

      throw new ConflictException(
        'Cannot delete, a segurance alert has been sent to the main admin',
      );
    }

    if (!user) {
      throw new ConflictException('User not found');
    }

    await this.usersRepository.delete(user.id);

    return { message: 'User deleted successfully' };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.findByEmailUtil(changePasswordDto.email);

    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password,
      );

      if (isPasswordMatching) {
        const hashedPassword = await bcrypt.hash(
          changePasswordDto.newPassword,
          10,
        );
        user.password = hashedPassword;
        await this.usersRepository.save(user);

        return { message: 'Password changed successfully' };
      }

      throw new ConflictException('Invalid password');
    }

    throw new ConflictException('User not found');
  }

  async activateTwoFA(email: string) {
    const user = await this.findByEmailUtil(email.toLowerCase());

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
    const user = await this.findByEmailUtil(email.toLowerCase());

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === 'admin') {
      throw new ConflictException(
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
    const user = await this.findByEmailUtil(email);

    if (!user) {
      throw new ConflictException('User not found');
    }

    if (user.email === process.env.MAIN_ADMIN) {
      const report = `Houve uma tentativa de remoção do usuário ${user.email}`;
      await this.emailService.sendReportAlertAdmin(report);

      throw new ConflictException(
        'Cannot delete main admin, a segurance alert has been sent to the main admin',
      );
    }

    await this.usersRepository.delete(user.id);

    return { message: 'Account deleted successfully' };
  }
}
