import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Redacao } from '../../entities/redacao.entity';
import { DeleteRedacaoService } from './deleteRedacao.service';

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

const redacaoEntity = new Redacao({
  id: 1,
  content: 'test content',
  title: 'test title',
  topic: 'test topic',
  createdAt: new Date(),
  statusCorrecao: 'status test',
  statusEnvio: 'status test',
  updatedAt: new Date(),
  user: userEntity,
});

describe('DeleteRedacaoService', () => {
  let service: DeleteRedacaoService;
  let redacaoRepository: Repository<Redacao>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteRedacaoService,
        {
          provide: getRepositoryToken(Redacao),
          useValue: {
            findOne: jest.fn().mockResolvedValue(redacaoEntity),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn().mockResolvedValue(userEntity) },
        },
      ],
    }).compile();

    service = module.get<DeleteRedacaoService>(DeleteRedacaoService);
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

  describe('deleteRedacaoById', () => {
    it('should delete a redacao', async () => {
      const result = await service.deleteRedacaoById('userId', 1);

      expect(result).toBeUndefined();
      expect(redacaoRepository.findOne).toHaveBeenCalledTimes(1);
      expect(redacaoRepository.delete).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if userId is not provided', async () => {
      await expect(service.deleteRedacaoById('', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if redacaoId is invalid', async () => {
      await expect(service.deleteRedacaoById('userId', NaN)).rejects.toThrow(
        BadRequestException,
      );

      await expect(service.deleteRedacaoById('userId', null)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.deleteRedacaoById('userId', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if redacao is not found', async () => {
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.deleteRedacaoById('userId', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException if delete fails', async () => {
      jest
        .spyOn(redacaoRepository, 'delete')
        .mockRejectedValueOnce(new Error('Delete failed'));

      await expect(service.deleteRedacaoById('userId', 1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
