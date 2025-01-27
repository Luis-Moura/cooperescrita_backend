import { Injectable } from '@nestjs/common';

@Injectable()
export class CorrecoesService {
  create() {
    return 'This action adds a new correcoe';
  }

  findAll() {
    return `This action returns all correcoes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} correcoe`;
  }

  update(id: number) {
    return `This action updates a #${id} correcoe`;
  }

  remove(id: number) {
    return `This action removes a #${id} correcoe`;
  }
}
