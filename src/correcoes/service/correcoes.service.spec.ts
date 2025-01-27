import { Test, TestingModule } from '@nestjs/testing';
import { CorrecoesService } from './correcoes.service';

describe('CorrecoesService', () => {
  let service: CorrecoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorrecoesService],
    }).compile();

    service = module.get<CorrecoesService>(CorrecoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
