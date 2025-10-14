import { Test, TestingModule } from '@nestjs/testing';
import { GetRedacaoController } from './getRedacao.controller';
import { GetRedacaoService } from '../services/getRedacao.service';
import { IGetRedacoes } from '../interfaces/IGetRedacoes';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

describe('GetRedacaoController', () => {
  let controller: GetRedacaoController;
  let service: GetRedacaoService;

  const mockRedacoesResponse: IGetRedacoes = {
    redacoes: [
      {
        id: 1,
        title: 'Título da Redação',
        topic: 'Tópico',
        userName: 'Nome do Usuário',
        userId: 'test-user-id',
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

  const mockRequest = {
    user: {
      userId: 'test-user-id',
    },
    params: {
      id: '1',
    },
  };

  beforeEach(async () => {
    const mockService = {
      getPublicRedacoes: jest.fn().mockResolvedValue(mockRedacoesResponse),
      getMyRedacoes: jest.fn().mockResolvedValue(mockRedacoesResponse),
      getRedacaoById: jest
        .fn()
        .mockResolvedValue(mockRedacoesResponse.redacoes[0]),
    };

    const mockAuthGuard = { canActivate: jest.fn().mockReturnValue(true) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetRedacaoController],
      providers: [
        {
          provide: GetRedacaoService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<GetRedacaoController>(GetRedacaoController);
    service = module.get<GetRedacaoService>(GetRedacaoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRedacoes (public)', () => {
    it('should return public redacoes successfully', async () => {
      // Act
      const result = await controller.getRedacoes(
        mockRequest as any,
        10,
        0,
        {},
      );

      // Assert
      expect(result).toEqual(mockRedacoesResponse);
      expect(service.getPublicRedacoes).toHaveBeenCalledWith(
        'test-user-id',
        10,
        0,
        {},
      );
    });

    it('should limit to max 50 items', async () => {
      // Act
      await controller.getRedacoes(mockRequest as any, 100, 0, {});

      // Assert
      expect(service.getPublicRedacoes).toHaveBeenCalledWith(
        'test-user-id',
        50,
        0,
        {},
      );
    });

    it('should handle exceptions from service', async () => {
      // Arrange
      jest
        .spyOn(service, 'getPublicRedacoes')
        .mockRejectedValue(new NotFoundException('Redacoes not found'));

      // Act & Assert
      await expect(
        controller.getRedacoes(mockRequest as any, 10, 0, {}),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPrivateRedacoes', () => {
    it('should return private redacoes successfully', async () => {
      // Act
      const result = await controller.getPrivateRedacoes(
        mockRequest as any,
        10,
        0,
        {},
      );

      // Assert
      expect(result).toEqual(mockRedacoesResponse);
      expect(service.getMyRedacoes).toHaveBeenCalledWith(
        'test-user-id',
        10,
        0,
        {},
      );
    });

    it('should pass order queries correctly', async () => {
      // Arrange
      const orderQuery = {
        order: 'decrescente' as const,
        statusEnvio: 'rascunho' as const,
        statusCorrecao: 'corrigidas' as const,
      };

      // Act
      await controller.getPrivateRedacoes(
        mockRequest as any,
        10,
        0,
        orderQuery,
      );

      // Assert
      expect(service.getMyRedacoes).toHaveBeenCalledWith(
        'test-user-id',
        10,
        0,
        orderQuery,
      );
    });

    it('should handle error when service throws BadRequestException', async () => {
      // Arrange
      jest
        .spyOn(service, 'getMyRedacoes')
        .mockRejectedValue(new BadRequestException('Invalid statusEnvio'));

      // Act & Assert
      await expect(
        controller.getPrivateRedacoes(mockRequest as any, 10, 0, {
          statusEnvio: 'invalid' as any,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getRedacaoById', () => {
    it('should return redacao by id', async () => {
      // Act
      const result = await controller.getRedacaoById(mockRequest as any);

      // Assert
      expect(result).toEqual(mockRedacoesResponse.redacoes[0]);
      expect(service.getRedacaoById).toHaveBeenCalledWith('test-user-id', 1);
    });

    it('should handle exceptions from service', async () => {
      // Arrange
      jest
        .spyOn(service, 'getRedacaoById')
        .mockRejectedValue(new NotFoundException('Redacao not found'));

      // Act & Assert
      await expect(
        controller.getRedacaoById(mockRequest as any),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
