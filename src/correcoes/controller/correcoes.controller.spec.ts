import { Test, TestingModule } from '@nestjs/testing';
import { CorrecoesService } from '../service/correcoes.service';
import { CorrecoesController } from './correcoes.controller';

describe('CorrecoesController', () => {
  let controller: CorrecoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorrecoesController],
      providers: [CorrecoesService],
    }).compile();

    controller = module.get<CorrecoesController>(CorrecoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
