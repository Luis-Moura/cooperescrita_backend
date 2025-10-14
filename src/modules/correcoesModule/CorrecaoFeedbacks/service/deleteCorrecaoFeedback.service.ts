import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/modules/correcoesModule/entities/correcao.entity';
import { CorrecaoFeedback } from 'src/modules/correcoesModule/entities/correcaoFeedback.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteCorrecaoFeedbackService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(CorrecaoFeedback)
    private readonly correcaoFeedbackRepository: Repository<CorrecaoFeedback>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async deleteCorrecaoFeedback(
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

    // Verifica se o feedback existe
    const correcaoFeedback = await this.correcaoFeedbackRepository.findOne({
      where: {
        correcaoFeedbackId: feedbackId,
        correcao: { correcaoId: correcao.correcaoId },
      },
      relations: ['user'],
    });

    if (!correcaoFeedback) throw new NotFoundException('Feedback not found');

    if (correcaoFeedback.user.id !== userId) {
      throw new NotFoundException(
        "You don't have permission to delete this feedback",
      );
    }

    await this.correcaoFeedbackRepository.remove(correcaoFeedback);
    return { message: 'Feedback deleted successfully' };
  }
}
