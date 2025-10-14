import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { LessThan, Not, IsNull, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly verificationExpiryHours: number;
  private readonly isProduction: boolean;

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly emailsService: EmailsService,
  ) {
    const USER_VERIFICATION_EXPIRY_HOURS =
      process.env.USER_VERIFICATION_EXPIRY_HOURS;

    this.verificationExpiryHours = this.configService.get<number>(
      'USER_VERIFICATION_EXPIRY_HOURS',
      USER_VERIFICATION_EXPIRY_HOURS
        ? parseInt(USER_VERIFICATION_EXPIRY_HOURS)
        : 24,
    );
    this.isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    this.logger.log(
      `TasksService inicializado. Expiração de verificação configurada para ${this.verificationExpiryHours} horas.`,
    );
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanUnverifiedUsers() {
    this.logger.log('Iniciando limpeza de usuários não verificados...');
    const startTime = Date.now();

    try {
      const accountCutoffDate = new Date();
      accountCutoffDate.setHours(
        accountCutoffDate.getHours() - this.verificationExpiryHours,
      );

      const usersToRemove = await this.usersRepository.find({
        where: { verified: false, createdAt: LessThan(accountCutoffDate) },
      });

      if (usersToRemove.length === 0) {
        this.logger.debug(
          'Nenhum usuário não verificado encontrado para remoção.',
        );
        return;
      }

      if (!this.isProduction) {
        usersToRemove.forEach((user) => {
          this.logger.debug(
            `Usuário para remoção: ID ${user.id}, Email: ${user.email}, Criado em: ${user.createdAt}`,
          );
        });
      } else {
        this.logger.log(
          `Encontrados ${usersToRemove.length} usuários não verificados para remoção.`,
        );
      }

      if (usersToRemove.length > 10) {
        await this.sendCleanupReport(usersToRemove);
      }

      const result = await this.usersRepository.remove(usersToRemove);

      const executionTime = Date.now() - startTime;
      this.logger.log(
        `Limpeza concluída. Removidos ${result.length} usuários em ${executionTime}ms.`,
      );
    } catch (error) {
      this.logger.error(
        `Falha ao executar limpeza de usuários não verificados: ${error.message}`,
        error.stack,
      );

      if (this.isProduction) {
        await this.notifyAdminAboutFailure('cleanUnverifiedUsers', error);
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanExpiredVerificationCodes() {
    this.logger.log('Iniciando limpeza de códigos de verificação expirados...');

    try {
      const now = new Date();
      const users = await this.usersRepository.find({
        where: {
          verificationCodeExpires: LessThan(now),
          verificationCode: Not(IsNull()),
        },
      });

      if (users.length === 0) {
        this.logger.debug('Nenhum código de verificação expirado encontrado.');
        return;
      }

      for (const user of users) {
        user.verificationCode = null;
        user.verificationCodeExpires = null;
      }

      await this.usersRepository.save(users);
      this.logger.log(
        `Limpos ${users.length} códigos de verificação expirados.`,
      );
    } catch (error) {
      this.logger.error(
        `Falha ao executar limpeza de códigos de verificação: ${error.message}`,
        error.stack,
      );
    }
  }

  private async sendCleanupReport(users: User[]) {
    try {
      const report = `
        Relatório de Limpeza de Usuários Não Verificados
        Data: ${new Date().toISOString()}
        Total de usuários removidos: ${users.length}

        Detalhes:
        - Idade média das contas: ${this.calculateAverageAccountAge(users)} horas
        - Dominios mais comuns: ${this.getCommonDomains(users)}
      `;

      await this.emailsService.sendReportAlertAdmin(report);
    } catch (error) {
      this.logger.warn(
        `Não foi possível enviar relatório de limpeza: ${error.message}`,
      );
    }
  }

  private async notifyAdminAboutFailure(taskName: string, error: Error) {
    try {
      const report = `
        Erro em Tarefa Agendada: ${taskName}
        Data: ${new Date().toISOString()}
        Erro: ${error.message}
        Stack: ${error.stack}
      `;

      await this.emailsService.sendReportAlertAdmin(report);
    } catch (notifyError) {
      this.logger.error(
        `Falha ao notificar administrador sobre erro: ${notifyError.message}`,
      );
    }
  }

  private calculateAverageAccountAge(users: User[]): number {
    if (users.length === 0) return 0;

    const now = new Date();
    const totalHours = users.reduce((sum, user) => {
      const ageInMs = now.getTime() - user.createdAt.getTime();
      return sum + ageInMs / (1000 * 60 * 60);
    }, 0);

    return Math.round((totalHours / users.length) * 10) / 10;
  }

  private getCommonDomains(users: User[]): string {
    if (users.length === 0) return 'N/A';

    const domains = users.map((user) => {
      const email = user.email || '';
      return email.substring(email.lastIndexOf('@') + 1);
    });

    const domainCounts: Record<string, number> = domains.reduce(
      (acc, domain) => {
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topDomains = Object.entries(domainCounts)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 3)
      .map(([domain, count]) => `${domain} (${count})`)
      .join(', ');

    return topDomains || 'N/A';
  }
}
