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
import { CreateCorrecaoDto } from '../dto/createCorrecao.dto';
import { Correcao } from '../../entities/correcao.entity';

@Injectable()
export class CorrecoesService {
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
    status: 'rascunho' | 'enviado',
  ) {
    const { correcaoId } = createCorrecaoDto;

    // Validação do usuário
    if (!corretorId) throw new NotFoundException('Usuário não encontrado');

    const user = await this.userRepository.findOne({
      where: { id: corretorId },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    // Validação da redação
    const redacao = await this.redacaoRepository.findOne({
      where: { id: createCorrecaoDto.redacaoId },
      relations: ['correcoes'], // Carrega correções existentes
    });

    if (!redacao) throw new NotFoundException('Redação não encontrada');

    // Validação do limite de 15 corretores (apenas para definitivo)
    if (status === 'enviado' && redacao.correcoes.length >= 15) {
      throw new BadRequestException('Limite de 15 corretores atingido');
    }

    // Verifica se o usuário já tem uma correção (rascunho ou enviada) para esta redação
    const existingCorrecao = await this.correcaoRepository.findOne({
      where: { corretor: { id: corretorId }, redacao: { id: redacao.id } },
    });

    if (!correcaoId && existingCorrecao) {
      throw new BadRequestException('Correção já existente');
    }

    let correcao: Correcao;
    let shouldUpdateRedacaoStatus = false; // Nova flag para controle

    if (correcaoId) {
      // Atualização de rascunho existente
      correcao = await this.correcaoRepository.findOne({
        where: { correcaoId, corretor: { id: corretorId } },
      });

      if (!correcao) throw new NotFoundException('Correção não encontrada');

      if (correcao.statusEnvio === 'enviado') {
        throw new BadRequestException(
          'Correção definitiva não pode ser editada',
        );
      }

      // Atualiza o status e verifica se é uma conversão para definitivo
      if (status === 'enviado') {
        correcao.statusEnvio = status;
        redacao.statusCorrecao = 'corrigida'; // ✅ Atualiza status da redação
        shouldUpdateRedacaoStatus = true;
      }
    } else {
      // Criação de nova correção
      correcao = this.correcaoRepository.create({
        statusEnvio: status,
        corretor: { id: corretorId },
        redacao: { id: createCorrecaoDto.redacaoId },
      });

      // Só marca como corrigida se for definitivo
      if (status === 'enviado') {
        redacao.statusCorrecao = 'corrigida'; // ✅ Apenas para envios definitivos
        shouldUpdateRedacaoStatus = true;
      }
    }

    try {
      // Salva a redação apenas se houver mudança de status
      if (shouldUpdateRedacaoStatus) {
        await this.redacaoRepository.save(redacao);
      }

      return await this.correcaoRepository.save(correcao);
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao salvar correção: ${error.message}`,
      );
    }
  }
}
