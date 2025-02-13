import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import { CorrecaoFeedback } from 'src/correcoesModule/entities/correcaoFeedback.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCorrecaoFeedbackDto } from '../dto/createCorrecaoFeedback.dto';

@Injectable()
export class CreateCorrecaoFeedbackService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(CorrecaoFeedback)
    private readonly correcaoFeedbackRepository: Repository<CorrecaoFeedback>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createCorrecaoFeedback(
    userId: string,
    createCorrecaoFeedbackDto: CreateCorrecaoFeedbackDto,
    correcaoId: number,
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

    // Impede que o próprio corretor avalie sua correção
    if (correcao.corretor.id === userId) {
      throw new ForbiddenException(
        'You cannot give feedback on your own correction',
      );
    }

    // verifica se o usuario já fez um feedback para a correção
    const existingFeedback = await this.correcaoFeedbackRepository.findOne({
      where: {
        correcao: { correcaoId: correcaoId },
        user: { id: userId },
      },
    });

    if (existingFeedback) {
      throw new ForbiddenException(
        'You have already provided feedback for this correction',
      );
    }

    // cria o feedback
    const feedback = this.correcaoFeedbackRepository.create({
      ...createCorrecaoFeedbackDto,
      correcao,
      user: user,
    });

    await this.correcaoFeedbackRepository.save(feedback);

    return {
      message: 'Feedback successfully created',
      ...feedback,
      correcao: correcaoId,
      user: userId,
    };
  }
}
