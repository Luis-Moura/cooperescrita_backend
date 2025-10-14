import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailsService } from 'src/modules/emails/emails.service';
import { Redacao } from 'src/modules/redacoesModule/entities/redacao.entity';
import { Correcao } from 'src/modules/correcoesModule/entities/correcao.entity';
import { RedacaoComments } from 'src/modules/redacoesModule/entities/redacaoComments.entity';
import { CorrecaoComments } from 'src/modules/correcoesModule/entities/correcaoComments.entity';
import { CorrecaoHighlights } from 'src/modules/correcoesModule/entities/correcaoHighlights.entity';
import { CorrecaoSuggestions } from 'src/modules/correcoesModule/entities/correcaoSuggestions.entity';
import { CorrecaoFeedback } from 'src/modules/correcoesModule/entities/correcaoFeedback.entity';

@Injectable()
export class AdminDeletionService {
  private readonly logger = new Logger(AdminDeletionService.name);

  constructor(
    @InjectRepository(Redacao)
    private redacoesRepository: Repository<Redacao>,
    @InjectRepository(Correcao)
    private correcoesRepository: Repository<Correcao>,
    private emailsService: EmailsService,
  ) {}

  async deleteRedacao(
    id: number,
    adminUser: { id: string; name: string; email: string },
    context = 'admin action',
  ) {
    this.logger.log(
      `Admin ${adminUser.name} (ID: ${adminUser.id}) deleting redacao ${id} via ${context}`,
    );

    return await this.redacoesRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const redacao = await transactionalEntityManager.findOne(Redacao, {
          where: { id },
          relations: ['user'],
        });

        if (!redacao) {
          throw new NotFoundException('Redação não encontrada');
        }

        // Deletar comentários relacionados
        await transactionalEntityManager.delete(RedacaoComments, {
          redacao: { id },
        });

        // Deletar redação (correções serão deletadas automaticamente por CASCADE)
        await transactionalEntityManager.delete(Redacao, { id });

        // Registrar log da ação
        this.logger.log(
          `Admin ${adminUser.name} (ID: ${adminUser.id}) deleted redacao ${id} (author: ${redacao.user.email}) via ${context}`,
        );

        // Notificar admin principal
        await this.emailsService.sendReportAlertAdmin(
          `Redação deletada por admin: "${redacao.title}" do usuário ${redacao.user.email} foi removida por ${adminUser.name} (${context})`,
        );

        return {
          message: 'Redação deletada com sucesso',
          redacaoId: id,
          adminAction: adminUser.name,
          context,
        };
      },
    );
  }

  async deleteCorrecao(
    id: number,
    adminUser: { id: string; name: string; email: string },
    context = 'admin action',
  ) {
    this.logger.log(
      `Admin ${adminUser.name} (ID: ${adminUser.id}) deleting correcao ${id} via ${context}`,
    );

    return await this.correcoesRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const correcao = await transactionalEntityManager.findOne(Correcao, {
          where: { correcaoId: id },
          relations: ['corretor', 'redacao'],
        });

        if (!correcao) {
          throw new NotFoundException('Correção não encontrada');
        }

        // Deletar todos os dados relacionados
        await transactionalEntityManager.delete(CorrecaoFeedback, {
          correcao: { correcaoId: id },
        });

        await transactionalEntityManager.delete(CorrecaoComments, {
          correcao: { correcaoId: id },
        });

        await transactionalEntityManager.delete(CorrecaoHighlights, {
          correcao: { correcaoId: id },
        });

        await transactionalEntityManager.delete(CorrecaoSuggestions, {
          correcao: { correcaoId: id },
        });

        // Deletar a correção
        await transactionalEntityManager.delete(Correcao, { correcaoId: id });

        // Registrar log da ação
        this.logger.log(
          `Admin ${adminUser.name} (ID: ${adminUser.id}) deleted correcao ${id} (author: ${correcao.corretor.email}) via ${context}`,
        );

        // Notificar admin principal
        await this.emailsService.sendReportAlertAdmin(
          `Correção deletada por admin: Correção #${id} do usuário ${correcao.corretor.email} foi removida por ${adminUser.name} (${context})`,
        );

        return {
          message: 'Correção deletada com sucesso',
          correcaoId: id,
          adminAction: adminUser.name,
          context,
        };
      },
    );
  }
}
