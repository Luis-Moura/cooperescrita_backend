import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Correcao } from '../../entities/correcao.entity';
import { CreateCorrecaoDto } from '../dto/createCorrecao.dto';

@Injectable()
export class CreateCorrecoesService {
  constructor(
    @InjectRepository(Correcao)
    private readonly correcaoRepository: Repository<Correcao>,
    @InjectRepository(Redacao)
    private readonly redacaoRepository: Repository<Redacao>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createDefinitiveCorrecao(
    corretorId: string,
    createCorrecaoDto: CreateCorrecaoDto,
  ) {
    return this.saveCorrecao(corretorId, createCorrecaoDto, 'enviado');
  }

  async createDraftCorrecao(
    corretorId: string,
    createCorrecaoDto: CreateCorrecaoDto,
  ) {
    return this.saveCorrecao(corretorId, createCorrecaoDto, 'rascunho');
  }

  private async saveCorrecao(
    corretorId: string,
    createCorrecaoDto: CreateCorrecaoDto,
    status: 'enviado' | 'rascunho',
  ) {
    // verificar a existência do corretor
    if (!corretorId) throw new NotFoundException('User not found');

    const corretor: User = await this.userRepository.findOne({
      where: { id: corretorId },
    });

    if (!corretor) throw new NotFoundException('User not found');

    // verificar a existência da redação
    if (!createCorrecaoDto.redacaoId)
      throw new BadRequestException('Redacao not found');

    const redacao: Redacao = await this.redacaoRepository.findOne({
      where: { id: createCorrecaoDto.redacaoId },
    });

    if (!redacao) throw new NotFoundException('Redacao not found');

    // verificar se a redação já foi corrigida por esse corretor
    const correcaoExistente: Correcao = await this.correcaoRepository.findOne({
      where: {
        redacao: { id: redacao.id },
        corretor: { id: corretor.id },
        statusEnvio: 'enviado',
      },
    });

    if (correcaoExistente)
      throw new BadRequestException('Correcao already exists');

    // verifica se o corretor já tem uma correção em rascunho
    const correcaoRascunho: Correcao = await this.correcaoRepository.findOne({
      where: {
        redacao: { id: redacao.id },
        corretor: { id: corretor.id },
        statusEnvio: 'rascunho',
      },
    });

    if (correcaoRascunho && !createCorrecaoDto.correcaoId)
      throw new BadRequestException('Draft correction already exists');

    // verifica se a correção já tem 15 correções
    const correcoes: Correcao[] = await this.correcaoRepository.find({
      where: { redacao: { id: redacao.id }, statusEnvio: 'enviado' },
    });

    if (correcoes.length >= 15)
      throw new BadRequestException('Redacao already has 15 corrections');

    let correcao: Correcao;

    if (createCorrecaoDto.correcaoId) {
      correcao = await this.correcaoRepository.findOne({
        where: { correcaoId: createCorrecaoDto.correcaoId },
      });

      if (!correcao) throw new NotFoundException('Correcao not found');

      correcao.statusEnvio = status;
      correcao = this.correcaoRepository.merge(correcao, createCorrecaoDto);
    } else {
      correcao = this.correcaoRepository.create({
        ...createCorrecaoDto,
        statusEnvio: status,
        redacao: { id: redacao.id },
        corretor: { id: corretor.id },
      });
    }

    try {
      return await this.correcaoRepository.save(correcao);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving correcao:\n',
        error.message,
      );
    }
  }
}
