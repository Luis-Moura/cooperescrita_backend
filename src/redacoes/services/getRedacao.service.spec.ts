import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Redacao } from '../entities/redacao.entity';
import { GetRedacaoService } from './getRedacao.service';

const userEntity = new User({
  id: 'userId',
  name: 'Test User',
  email: 'test@example.com',
  password: 'password',
  verified: true,
  role: 'user',
  twoFA: false,
  failedLoginAttempts: 0,
  lockUntil: null,
  verificationCode: null,
  verificationCodeExpires: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  redacoes: [],
});

const redacaoEntity = [
  new Redacao({
    id: 1,
    content: 'test content',
    title: 'test title',
    topic: 'test topic',
    createdAt: new Date(),
    statusCorrecao: 'status test',
    statusEnvio: 'status test',
    updatedAt: new Date(),
    user: userEntity,
  }),
];

describe('getRedacao', () => {
  let service: GetRedacaoService;
  let redacaoRepository: Repository<Redacao>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetRedacaoService,
        {
          provide: getRepositoryToken(Redacao),
          useValue: {
            find: jest.fn().mockResolvedValue(redacaoEntity),
            count: jest.fn().mockResolvedValue(1),
            findOne: jest.fn().mockResolvedValue(redacaoEntity[0]),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn().mockResolvedValue(userEntity) },
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
    expect(redacaoRepository).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('getRedacao', () => {
    it('should return a redacao', async () => {
      const result = await service.getRedacoes('userId', 10, 0, {
        order: 'crescente',
        statusEnvio: 'rascunho',
        statusCorrecao: 'nao-corrigidas',
      });

      expect(result).toEqual({ redacoes: redacaoEntity, totalRedacoes: 1 });
      expect(redacaoRepository.find).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if userId is not provided', async () => {
      await expect(
        service.getRedacoes('', 10, 0, {
          order: 'crescente',
          statusEnvio: 'rascunho',
          statusCorrecao: 'nao-corrigidas',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if limit or offset is invalid', async () => {
      await expect(
        service.getRedacoes('userId', NaN, 0, {
          order: 'crescente',
          statusEnvio: 'rascunho',
          statusCorrecao: 'nao-corrigidas',
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.getRedacoes('userId', 10, NaN, {
          order: 'crescente',
          statusEnvio: 'rascunho',
          statusCorrecao: 'nao-corrigidas',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.getRedacoes('userId', 10, 0, {
          order: 'crescente',
          statusEnvio: 'rascunho',
          statusCorrecao: 'nao-corrigidas',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if no redacoes are found', async () => {
      jest.spyOn(redacaoRepository, 'find').mockResolvedValueOnce([]);

      await expect(
        service.getRedacoes('userId', 10, 0, {
          order: 'crescente',
          statusEnvio: 'rascunho',
          statusCorrecao: 'nao-corrigidas',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
