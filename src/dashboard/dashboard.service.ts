import { Injectable } from '@nestjs/common';
import { DashboardUseCase } from './useCase/DashboardUseCase';
import { DashboardResponse, LastActivityDTO } from './dto/DashboardResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoesModule/entities/redacao.entity';
import { Repository } from 'typeorm';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';

@Injectable()
export class DashboardService implements DashboardUseCase {
  constructor(
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,

    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
  ) {}

  public async getDashboardInfo(userId: string): Promise<DashboardResponse> {
    const essayCreatedCount = await this.redacaoRepository.count({
      where: { user: { id: userId }, statusEnvio: 'enviado' },
    });

    const correctionReceivedCount = await this.correcaoRepository.count({
      where: { redacao: { user: { id: userId } }, statusEnvio: 'enviado' },
    });

    const correctionCreatedCount = await this.correcaoRepository.count({
      where: { corretor: { id: userId }, statusEnvio: 'enviado' },
    });

    // Buscar a última atividade (redação ou correção)
    const lastEssay = await this.redacaoRepository.findOne({
      where: { user: { id: userId }, statusEnvio: 'enviado' },
      order: { createdAt: 'DESC' },
    });

    const lastCorrection = await this.correcaoRepository.findOne({
      where: [{ corretor: { id: userId }, statusEnvio: 'enviado' }],
      order: { createdAt: 'DESC' },
      relations: ['redacao'],
    });

    const lastActivity: LastActivityDTO = this.getLastActivityDTO(
      lastEssay,
      lastCorrection,
    );

    return new DashboardResponse(
      essayCreatedCount,
      correctionReceivedCount,
      correctionCreatedCount,
      lastActivity,
    );
  }

  private getLastActivityDTO(
    lastEssay: Redacao | null,
    lastCorrection: Correcao | null,
  ): LastActivityDTO | null {
    if (
      lastEssay &&
      (!lastCorrection || lastEssay.createdAt > lastCorrection.createdAt)
    ) {
      return {
        id: lastEssay.id,
        type: 'redacao',
        topic: lastEssay.topic,
        createdAt: lastEssay.createdAt,
      };
    } else if (lastCorrection) {
      return {
        id: lastCorrection.correcaoId,
        type: 'correcao',
        topic: lastCorrection.redacao?.topic,
        createdAt: lastCorrection.createdAt,
      };
    }

    return null;
  }
}
