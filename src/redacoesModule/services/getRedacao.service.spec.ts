import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Redacao } from '../entities/redacao.entity';
import { GetRedacaoService } from './getRedacao.service';

describe('GetRedacaoService', () => {
  let service: GetRedacaoService;
  let redacaoRepository: Repository<Redacao>;
  let userRepository: Repository<User>;

  const mockUser = {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
  };

  const mockRedacaoPublica = {
    id: 1,
    title: 'Redação Pública',
    topic: 'Tópico Teste',
    content: 'Conteúdo Teste',
    statusEnvio: 'enviado',
    statusCorrecao: 'nao_corrigida',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
    correcoes: [],
    comentariosRedacao: [],
  };

  const mockRedacaoRascunho = {
    id: 2,
    title: 'Redação Rascunho',
    topic: 'Tópico Rascunho',
    content: 'Conteúdo Rascunho',
    statusEnvio: 'rascunho',
    statusCorrecao: 'nao_corrigida',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: mockUser,
    correcoes: [],
    comentariosRedacao: [],
  };

  const mockRedacaoOutroUsuario = {
    id: 3,
    title: 'Redação Outro Usuário',
    topic: 'Tópico Teste',
    content: 'Conteúdo Teste',
    statusEnvio: 'rascunho',
    statusCorrecao: 'nao_corrigida',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { ...mockUser, id: 'outro-user-id' },
    correcoes: [],
    comentariosRedacao: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetRedacaoService,
        {
          provide: getRepositoryToken(Redacao),
          useClass: Repository,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetRedacaoService>(GetRedacaoService);
    redacaoRepository = module.get<Repository<Redacao>>(
      getRepositoryToken(Redacao),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPublicRedacoes', () => {
    it('should return public redacoes successfully', async () => {
      // Arrange
      const userId = 'test-user-id';
      const limit = 10;
      const offset = 0;
      const orderQuery = { order: 'crescente' as const };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest
        .spyOn(redacaoRepository, 'find')
        .mockResolvedValue([mockRedacaoPublica] as Redacao[]);
      jest.spyOn(redacaoRepository, 'count').mockResolvedValue(1);

      // Act
      const result = await service.getPublicRedacoes(
        userId,
        limit,
        offset,
        orderQuery,
      );

      // Assert
      expect(result).toEqual({
        redacoes: expect.arrayContaining([
          expect.objectContaining({
            id: mockRedacaoPublica.id,
            user: mockUser.name,
            statusEnvio: 'enviado',
          }),
        ]),
        totalRedacoes: 1,
      });
      expect(redacaoRepository.find).toHaveBeenCalledWith({
        where: { statusEnvio: 'enviado' },
        order: { createdAt: 'ASC' },
        take: limit,
        skip: offset,
        relations: ['user'],
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Arrange
      const userId = 'non-existent-id';
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.getPublicRedacoes(userId, 10, 0, {}),
      ).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw BadRequestException when limit or offset are invalid', async () => {
      // Act & Assert
      await expect(
        service.getPublicRedacoes('test-user-id', NaN, 0, {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when no redacoes are found', async () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(redacaoRepository, 'find').mockResolvedValue([]);
      jest.spyOn(redacaoRepository, 'count').mockResolvedValue(0);

      // Act & Assert
      await expect(
        service.getPublicRedacoes('test-user-id', 10, 0, {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('should filter by statusCorrecao correctly', async () => {
      // Arrange
      const orderQuery = { statusCorrecao: 'corrigidas' as const };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest
        .spyOn(redacaoRepository, 'find')
        .mockResolvedValue([mockRedacaoPublica] as Redacao[]);
      jest.spyOn(redacaoRepository, 'count').mockResolvedValue(1);

      // Act
      await service.getPublicRedacoes('test-user-id', 10, 0, orderQuery);

      // Assert
      expect(redacaoRepository.find).toHaveBeenCalledWith({
        where: { statusEnvio: 'enviado', statusCorrecao: 'corrigida' },
        order: {},
        take: 10,
        skip: 0,
        relations: ['user'],
      });
    });

    it('should throw BadRequestException when order is invalid', async () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);

      // Act & Assert
      await expect(
        service.getPublicRedacoes('test-user-id', 10, 0, {
          order: 'invalid' as any,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getMyRedacoes', () => {
    it('should return user redacoes successfully', async () => {
      // Arrange
      const userId = 'test-user-id';
      const limit = 10;
      const offset = 0;
      const orderQuery = { order: 'decrescente' as const };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest
        .spyOn(redacaoRepository, 'find')
        .mockResolvedValue([
          mockRedacaoPublica,
          mockRedacaoRascunho,
        ] as Redacao[]);
      jest.spyOn(redacaoRepository, 'count').mockResolvedValue(2);

      // Act
      const result = await service.getMyRedacoes(
        userId,
        limit,
        offset,
        orderQuery,
      );

      // Assert
      expect(result).toEqual({
        redacoes: expect.arrayContaining([
          expect.objectContaining({ id: mockRedacaoPublica.id }),
          expect.objectContaining({ id: mockRedacaoRascunho.id }),
        ]),
        totalRedacoes: 2,
      });
      expect(redacaoRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
        take: limit,
        skip: offset,
        relations: ['user'],
      });
    });

    it('should filter by statusEnvio correctly', async () => {
      // Arrange
      const orderQuery = { statusEnvio: 'rascunho' as const };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest
        .spyOn(redacaoRepository, 'find')
        .mockResolvedValue([mockRedacaoRascunho] as Redacao[]);
      jest.spyOn(redacaoRepository, 'count').mockResolvedValue(1);

      // Act
      await service.getMyRedacoes('test-user-id', 10, 0, orderQuery);

      // Assert
      expect(redacaoRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 'test-user-id' }, statusEnvio: 'rascunho' },
        order: {},
        take: 10,
        skip: 0,
        relations: ['user'],
      });
    });

    it('should throw BadRequestException when statusEnvio is invalid', async () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);

      // Act & Assert
      await expect(
        service.getMyRedacoes('test-user-id', 10, 0, {
          statusEnvio: 'invalid' as any,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getRedacaoById', () => {
    it('should return redacao by id when user is owner', async () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest
        .spyOn(redacaoRepository, 'findOne')
        .mockResolvedValue(mockRedacaoRascunho as Redacao);

      // Act
      const result = await service.getRedacaoById('test-user-id', 2);

      // Assert
      expect(result).toEqual(mockRedacaoRascunho);
    });

    it('should return public redacao when user is not owner', async () => {
      // Arrange
      const publicRedacao = {
        ...mockRedacaoPublica,
        user: { ...mockUser, id: 'outro-user-id' },
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest
        .spyOn(redacaoRepository, 'findOne')
        .mockResolvedValue(publicRedacao as Redacao);

      // Act
      const result = await service.getRedacaoById('test-user-id', 1);

      // Assert
      expect(result).toEqual(publicRedacao);
    });

    it('should throw ForbiddenException when trying to access draft from another user', async () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest
        .spyOn(redacaoRepository, 'findOne')
        .mockResolvedValue(mockRedacaoOutroUsuario as Redacao);

      // Act & Assert
      await expect(service.getRedacaoById('test-user-id', 3)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw NotFoundException when redacao is not found', async () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(service.getRedacaoById('test-user-id', 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when id is invalid', async () => {
      // Act & Assert
      await expect(service.getRedacaoById('test-user-id', NaN)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
