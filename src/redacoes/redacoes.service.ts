import { Injectable } from '@nestjs/common';
import { CreateRedacaoDto } from './dto/create-redacao.dto';

@Injectable()
export class RedacoesService {
  create(redacaoDto: CreateRedacaoDto) {
    return 'This action adds a new redacoe' + redacaoDto;
  }
}
