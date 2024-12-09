import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailsService } from 'src/emails/emails.service';
import { Repository } from 'typeorm';
import { FindByEmailDto } from '../dto/find-by-email.dto';
import { FindByNameDto } from '../dto/find-by-name.dto';
import { User } from '../entities/user.entity';
import { UtilsService } from './utils.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly emailService: EmailsService,
    private readonly utilsService: UtilsService,
  ) {}

  async findByEmail(findByEmailDto: FindByEmailDto, sender: string) {
    const user = await this.utilsService.findByEmailUtil(findByEmailDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email === process.env.MAIN_ADMIN) {
      const report = `O usuário ${sender} tentou acessar o usuário ${user.email}`;
      await this.emailService.sendReportAlertAdmin(report);

      throw new ForbiddenException(
        'Cannot access, a security alert has been sent to the main admin',
      );
    }

    return { ...user, password: undefined };
  }

  async findByName(findByNameDto: FindByNameDto, sender: string) {
    const user = await this.usersRepository.findOne({
      where: { name: findByNameDto.name },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email === process.env.MAIN_ADMIN) {
      const report = `O usuário ${sender} tentou acessar o usuário ${user.email}`;
      await this.emailService.sendReportAlertAdmin(report);

      throw new ForbiddenException(
        'Cannot access, a security alert has been sent to the main admin',
      );
    }

    return { ...user, password: undefined };
  }

  async deleteUserByEmail(findByEmailDto: FindByEmailDto, sender: string) {
    const user = await this.utilsService.findByEmailUtil(findByEmailDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email === process.env.MAIN_ADMIN) {
      const report = `O usuário ${sender} tentou DELETAR o usuário ${user.email}`;
      await this.emailService.sendReportAlertAdmin(report);

      throw new ForbiddenException(
        'Cannot delete, a security alert has been sent to the main admin',
      );
    }

    await this.usersRepository.delete(user.id);

    return { message: 'User deleted successfully' };
  }
}
