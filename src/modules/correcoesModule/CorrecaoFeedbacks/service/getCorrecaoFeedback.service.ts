import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/modules/correcoesModule/entities/correcao.entity';
import { CorrecaoFeedback } from 'src/modules/correcoesModule/entities/correcaoFeedback.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetCorrecaoFeedbackService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(CorrecaoFeedback)
    private readonly correcaoFeedbackRepository: Repository<CorrecaoFeedback>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCorrecaoFeedback(userId: string, correcaoId: number) {
    // verificar a existência do usuario
    if (!userId) throw new NotFoundException('User not found');

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    // Verifica se a correção existe e carrega o corretor junto
    const correcao = await this.correcaoRepository.findOne({
      where: { correcaoId },
      relations: ['corretor'],
    });

    if (!correcao) throw new NotFoundException('Correction not found');

    // carrega as avaliações da correção
    const correcaoFeedbacks = await this.correcaoFeedbackRepository.find({
      where: {
        correcao: { correcaoId },
      },
      order: { createdAt: 'DESC' },
    });

    const totalLikes = correcaoFeedbacks.filter(
      (feedback) => feedback.feedbackType === 'like',
    ).length;

    const totalDislikes = correcaoFeedbacks.filter(
      (feedback) => feedback.feedbackType === 'dislike',
    ).length;

    return {
      correcaoId,
      totalLikes,
      totalDislikes,
      feedbacks: correcaoFeedbacks,
    };
  }

  async getCorrecaoFeedbackById(
    userId: string,
    correcaoId: number,
    feedbackId: number,
  ) {
    // verificar a existência do usuario
    if (!userId) throw new NotFoundException('User not found');

    const user: User = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    // Verifica se a correção existe e carrega o corretor junto
    const correcao = await this.correcaoRepository.findOne({
      where: { correcaoId },
      relations: ['corretor'],
    });

    if (!correcao) throw new NotFoundException('Correction not found');

    // carrega a avaliação da correção
    const correcaoFeedback = await this.correcaoFeedbackRepository.findOne({
      where: {
        correcao: { correcaoId },
        correcaoFeedbackId: feedbackId,
      },
    });

    if (!correcaoFeedback) throw new NotFoundException('Feedback not found');

    return correcaoFeedback;
  }
}
