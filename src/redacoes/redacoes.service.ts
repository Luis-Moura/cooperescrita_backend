import { Injectable } from '@nestjs/common';
import { RedacaoDto } from './dto/redacao.dto';

@Injectable()
export class RedacoesService {
  create(redacaoDto: RedacaoDto) {
    return 'This action adds a new redacoe' + redacaoDto;
  }
}
