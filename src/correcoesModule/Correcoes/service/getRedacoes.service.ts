import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Correcao } from 'src/correcoesModule/entities/correcao.entity';
import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { GetCorrecoesDto } from '../dto/getCorrecoes.dto';

@Injectable()
export class GetCorrecoesService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getCorrecoes(corretorId: string, getCorrecoesDto: GetCorrecoesDto) {
    // const { limit, offset, redacaoId, ordemLancamento, likes } =
    //   getCorrecoesDto;

    const { limit, offset, redacaoId, ordemLancamento } = getCorrecoesDto;

    if (!corretorId) {
      throw new NotFoundException('User not found');
    }

    if (
      isNaN(limit) ||
      isNaN(offset) ||
      limit === undefined ||
      offset === undefined
    ) {
      throw new BadRequestException('Invalid limit or offset');
    }

    const user: User = await this.userRepository.findOne({
      where: { id: corretorId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let order = {};
    const where: any = { corretor: { id: corretorId } };

    if (redacaoId) {
      where.redacao = { id: redacaoId };
    }

    if (ordemLancamento) {
      order =
        ordemLancamento === 'asc'
          ? { createdAt: 'ASC' }
          : { createdAt: 'DESC' };
    }

    // if (likes) {
    //   order = { likes: 'DESC' };
    // }

    const correcoes: Correcao[] = await this.correcaoRepository.find({
      where,
      order,
      relations: ['redacao'],
      take: limit,
      skip: offset,
    });

    const totalCorrecoes = await this.correcaoRepository.count({ where });

    if (correcoes.length === 0) {
      throw new NotFoundException('Correcoes not found');
    }

    return { correcoes, totalCorrecoes };
  }
}
