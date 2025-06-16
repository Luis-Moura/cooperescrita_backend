import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailsService } from 'src/emails/emails.service';
import { Like, Repository } from 'typeorm';
import { FindByEmailDto } from 'src/users/dto/find-by-email.dto';
import { FindByNameDto } from 'src/users/dto/find-by-name.dto';
import { PaginationDto } from 'src/users/dto/pagination.dto';
import { User } from 'src/users/entities/user.entity';
import { UtilsService } from 'src/users/services/utils.service';

@Injectable()
export class AdminUserService {
  private readonly logger = new Logger(AdminUserService.name);

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

      this.logger.warn(
        `Admin ${sender} attempted to access main admin account: ${user.email}`,
      );

      throw new ForbiddenException(
        'Cannot access, a security alert has been sent to the main admin',
      );
    }

    this.logger.log(`Admin ${sender} viewed user: ${user.email}`);
    return { ...user, password: undefined };
  }

  async findByName(findByNameDto: FindByNameDto, sender: string) {
    // Normalizar a busca e usar Like para busca parcial mais eficiente
    const normalizedName = findByNameDto.name.trim();

    if (normalizedName.length < 3) {
      throw new BadRequestException(
        'Search term must be at least 3 characters long',
      );
    }

    const user = await this.usersRepository.findOne({
      where: { name: Like(`%${normalizedName}%`) },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email === process.env.MAIN_ADMIN) {
      const report = `O usuário ${sender} tentou acessar o usuário ${user.email}`;
      await this.emailService.sendReportAlertAdmin(report);

      this.logger.warn(
        `Admin ${sender} attempted to access main admin account through name search: ${user.email}`,
      );
      throw new ForbiddenException(
        'Cannot access, a security alert has been sent to the main admin',
      );
    }

    this.logger.log(`Admin ${sender} viewed user by name: ${user.name}`);
    return { ...user, password: undefined };
  }

  async listUsers(paginationDto: PaginationDto, sender: string) {
    const { page = 1, limit = 10, search, role } = paginationDto;

    // Construir query base
    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder.select([
      'user.id',
      'user.name',
      'user.email',
      'user.role',
      'user.verified',
      'user.createdAt',
      'user.active',
    ]);

    // Aplicar filtros
    if (search) {
      queryBuilder.where(
        '(LOWER(user.name) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Proteger admin principal
    queryBuilder.andWhere('user.email != :mainAdmin', {
      mainAdmin: process.env.MAIN_ADMIN,
    });

    // Paginação
    const total = await queryBuilder.getCount();
    const users = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getMany();

    this.logger.log(
      `Admin ${sender} listed users, page ${page}, limit ${limit}`,
    );

    return {
      users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deleteUserByEmail(findByEmailDto: FindByEmailDto, sender: string) {
    const user = await this.utilsService.findByEmailUtil(findByEmailDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email === process.env.MAIN_ADMIN) {
      const report = `O usuário ${sender} tentou DELETAR o usuário ${user.email}`;
      await this.emailService.sendReportAlertAdmin(report);

      this.logger.warn(
        `Admin ${sender} attempted to DELETE main admin account: ${user.email}`,
      );

      throw new ForbiddenException(
        'Cannot delete, a security alert has been sent to the main admin',
      );
    }

    if (user.role === 'admin' && sender !== process.env.MAIN_ADMIN) {
      this.logger.warn(
        `Non-main admin ${sender} attempted to delete another admin: ${user.email}`,
      );
      throw new ForbiddenException(
        'Only the main admin can delete other admin accounts',
      );
    }

    // Implementar soft delete
    user.active = false;
    user.deactivatedAt = new Date();
    const anonymizedEmail = `deleted-${Date.now()}-${user.id}@anonymous.com`;
    user.email = anonymizedEmail;

    await this.usersRepository.save(user);

    // Notificar usuário
    await this.emailService.queueEmail(
      findByEmailDto.email, // Email original
      'Your Account Has Been Deleted - Cooperescrita',
      `<p>Your account has been deleted by an administrator.</p>
      <p>If you believe this was done in error, please contact our support team.</p>`,
    );

    this.logger.log(`Admin ${sender} deleted user: ${findByEmailDto.email}`);
    return { message: 'User deleted successfully' };
  }

  async toggleUserStatus(userId: string, sender: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email === process.env.MAIN_ADMIN) {
      const report = `O usuário ${sender} tentou suspender o usuário ${user.email}`;
      await this.emailService.sendReportAlertAdmin(report);

      this.logger.warn(
        `Admin ${sender} attempted to change status of main admin: ${user.email}`,
      );
      throw new ForbiddenException(
        'Cannot modify main admin, a security alert has been sent',
      );
    }

    if (user.role === 'admin' && sender !== process.env.MAIN_ADMIN) {
      this.logger.warn(
        `Non-main admin ${sender} attempted to change status of admin: ${user.email}`,
      );
      throw new ForbiddenException(
        'Only the main admin can modify other admin accounts',
      );
    }

    // Alternar status
    user.active = !user.active;

    if (!user.active) {
      user.deactivatedAt = new Date();
    } else {
      user.deactivatedAt = null;
    }

    await this.usersRepository.save(user);

    // Notificar usuário
    const actionText = user.active ? 'activated' : 'suspended';
    await this.emailService.queueEmail(
      user.email,
      `Your Account Has Been ${user.active ? 'Reactivated' : 'Suspended'} - Cooperescrita`,
      `<p>Your account has been ${actionText} by an administrator.</p>
      ${
        !user.active
          ? `<p>If you believe this was done in error, please contact our support team.</p>`
          : `<p>Welcome back! You can now log in to your account again.</p>`
      }`,
    );

    this.logger.log(`Admin ${sender} ${actionText} user: ${user.email}`);
    return {
      message: `User ${actionText} successfully`,
      active: user.active,
    };
  }
}
