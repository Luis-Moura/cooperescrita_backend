import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { GetRedacaoController } from '../../src/redacoesModule/controllers/getRedacao.controller';
import { GetRedacaoService } from '../../src/redacoesModule/services/getRedacao.service';
import { JwtAuthGuard } from '../../src/auth/guards/jwt-auth.guard';
import { IGetRedacoes } from '../../src/redacoesModule/interfaces/IGetRedacoes';

describe('GetRedacaoController (Integration)', () => {
  let app: INestApplication;

  const mockRedacoesResponse: IGetRedacoes = {
    redacoes: [
      {
        id: 1,
        title: 'Título da Redação',
        topic: 'Tópico',
        user: 'Nome do Usuário',
        content: 'Conteúdo da redação',
        statusEnvio: 'enviado',
        statusCorrecao: 'nao_corrigida',
        createdAt: new Date(),
        updatedAt: new Date(),
        correcoes: [],
        comentariosRedacao: [],
      },
    ],
    totalRedacoes: 1,
  };

  const mockRedacaoService = {
    getPublicRedacoes: jest.fn().mockResolvedValue(mockRedacoesResponse),
    getMyRedacoes: jest.fn().mockResolvedValue(mockRedacoesResponse),
    getRedacaoById: jest.fn().mockImplementation((userId, id) => {
      if (id === '999') {
        throw new Error('Redação não encontrada');
      }
      return mockRedacoesResponse.redacoes[0];
    }),
  };

  // Mock para o JwtAuthGuard que sempre autoriza o usuário
  const mockJwtAuthGuard = {
    canActivate: jest.fn().mockImplementation((context) => {
      // Adiciona usuário mockado ao request
      const req = context.switchToHttp().getRequest();
      req.user = { userId: 'test-user-id' };
      return true;
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [GetRedacaoController],
      providers: [
        {
          provide: GetRedacaoService,
          useValue: mockRedacaoService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /redacao/get-public-redacoes', () => {
    it('should return 200 and redacoes list', () => {
      return request(app.getHttpServer())
        .get('/redacao/get-public-redacoes?limit=10&offset=0')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('redacoes');
          expect(res.body).toHaveProperty('totalRedacoes');
          expect(mockRedacaoService.getPublicRedacoes).toHaveBeenCalled();
        });
    });

    it('should accept order and status parameters', () => {
      return request(app.getHttpServer())
        .get(
          '/redacao/get-public-redacoes?limit=10&offset=0&order=crescente&statusCorrecao=corrigidas',
        )
        .expect(200)
        .expect(() => {
          // Verificamos apenas que foi chamado, sem especificar os argumentos exatos
          expect(mockRedacaoService.getPublicRedacoes).toHaveBeenCalled();

          // Verificamos os parâmetros individualmente
          const call =
            mockRedacaoService.getPublicRedacoes.mock.calls[
              mockRedacaoService.getPublicRedacoes.mock.calls.length - 1
            ];
          expect(call[0]).toBe('test-user-id');
          // No NestJS, os parâmetros de query são passados como strings a menos que sejam
          // explicitamente convertidos com um ParseIntPipe ou manualmente no controller
          expect(typeof call[1]).toBe('string'); // Alterado para string
          expect(typeof call[2]).toBe('string'); // Alterado para string
          expect(call[3]).toHaveProperty('order', 'crescente');
          expect(call[3]).toHaveProperty('statusCorrecao', 'corrigidas');
        });
    });
  });

  describe('GET /redacao/get-private-redacoes', () => {
    it('should return 200 and user redacoes list', () => {
      return request(app.getHttpServer())
        .get('/redacao/get-private-redacoes?limit=10&offset=0')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('redacoes');
          expect(res.body).toHaveProperty('totalRedacoes');
          expect(mockRedacaoService.getMyRedacoes).toHaveBeenCalled();
        });
    });

    it('should accept all filter parameters', () => {
      return request(app.getHttpServer())
        .get(
          '/redacao/get-private-redacoes?limit=5&offset=10&order=decrescente&statusEnvio=rascunho&statusCorrecao=nao-corrigidas',
        )
        .expect(200)
        .expect(() => {
          // Verificamos apenas que foi chamado, sem especificar os argumentos exatos
          expect(mockRedacaoService.getMyRedacoes).toHaveBeenCalled();

          // Verificamos os parâmetros individualmente
          const call =
            mockRedacaoService.getMyRedacoes.mock.calls[
              mockRedacaoService.getMyRedacoes.mock.calls.length - 1
            ];
          expect(call[0]).toBe('test-user-id');
          expect(typeof call[1]).toBe('string'); // Alterado para string
          expect(typeof call[2]).toBe('string'); // Alterado para string
          expect(call[3]).toHaveProperty('order', 'decrescente');
          expect(call[3]).toHaveProperty('statusEnvio', 'rascunho');
          expect(call[3]).toHaveProperty('statusCorrecao', 'nao-corrigidas');
        });
    });
  });

  describe('GET /redacao/get-redacao/:id', () => {
    it('should return 200 and redacao details', () => {
      return request(app.getHttpServer())
        .get('/redacao/get-redacao/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 1);
          expect(res.body).toHaveProperty('title');

          // Verificamos que getRedacaoById foi chamado com o userId correto e o ID como número
          const call =
            mockRedacaoService.getRedacaoById.mock.calls[
              mockRedacaoService.getRedacaoById.mock.calls.length - 1
            ];
          expect(call[0]).toBe('test-user-id');
          expect(typeof call[1]).toBe('number'); // O controller converte para número com +id
          expect(call[1]).toBe(1);
        });
    });
  });
});
