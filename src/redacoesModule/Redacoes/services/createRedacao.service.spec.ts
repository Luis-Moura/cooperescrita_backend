import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { createDefinitiveRedacaoDto } from '../dto/createDefinitiveRedacaoDto';
import { createDraftRedacaoDto } from '../dto/createDraftRedacaoDto';
import { Redacao } from '../../entities/redacao.entity';
import { CreateRedacaoService } from './createRedacao.service';

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

describe('CreateRedacaoService', () => {
  let service: CreateRedacaoService;
  let redacaoRepository: Repository<Redacao>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateRedacaoService,
        {
          provide: getRepositoryToken(Redacao),
          useValue: {
            findOne: jest.fn().mockResolvedValue(redacaoEntity),
            create: jest.fn().mockReturnValue(redacaoEntity),
            save: jest.fn().mockResolvedValue(redacaoEntity),
            merge: jest.fn().mockReturnValue(redacaoEntity),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn().mockResolvedValue(userEntity) },
        },
      ],
    }).compile();

    service = module.get<CreateRedacaoService>(CreateRedacaoService);
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

  describe('createDefinitiveRedacao', () => {
    it('should create a definitive redacao', async () => {
      const redacaoDto: createDefinitiveRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      const result = await service.createDefinitiveRedacao(
        redacaoDto,
        'userId',
      );

      expect(result).toEqual(redacaoEntity);
      expect(redacaoRepository.create).toHaveBeenCalledTimes(1);
      expect(redacaoRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if userId is not provided', async () => {
      const redacaoDto: createDefinitiveRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      await expect(
        service.createDefinitiveRedacao(redacaoDto, ''),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const redacaoDto: createDefinitiveRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      await expect(
        service.createDefinitiveRedacao(redacaoDto, 'userId'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if redacao is not found when updating', async () => {
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValueOnce(null);

      const redacaoDto: createDefinitiveRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      await expect(
        service.createDefinitiveRedacao(redacaoDto, 'userId', 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if redacao is already sent', async () => {
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValueOnce({
        ...redacaoEntity,
        statusEnvio: 'enviado',
      });

      const redacaoDto: createDefinitiveRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      await expect(
        service.createDefinitiveRedacao(redacaoDto, 'userId', 1),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      jest
        .spyOn(redacaoRepository, 'save')
        .mockRejectedValueOnce(new Error('Save failed'));

      const redacaoDto: createDefinitiveRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      await expect(
        service.createDefinitiveRedacao(redacaoDto, 'userId'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createDraft', () => {
    it('should create a draft redacao', async () => {
      const redacaoDto: createDraftRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      const result = await service.createDraft('userId', redacaoDto);

      expect(result).toEqual(redacaoEntity);
      expect(redacaoRepository.create).toHaveBeenCalledTimes(1);
      expect(redacaoRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if userId is not provided', async () => {
      const redacaoDto: createDraftRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      await expect(service.createDraft('', redacaoDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const redacaoDto: createDraftRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      await expect(service.createDraft('userId', redacaoDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if redacao is not found when updating', async () => {
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValueOnce(null);

      const redacaoDto: createDraftRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      await expect(
        service.createDraft('userId', redacaoDto, 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      jest
        .spyOn(redacaoRepository, 'save')
        .mockRejectedValueOnce(new Error('Save failed'));

      const redacaoDto: createDraftRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      await expect(service.createDraft('userId', redacaoDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
