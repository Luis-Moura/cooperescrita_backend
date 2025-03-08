import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Redacao } from '../../entities/redacao.entity';
import { RedacaoComments } from '../../entities/redacaoComments.entity';
import { GetRedacaoCommentService } from '../service/getRedacaoComment.service';

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
});

const redacaoEntity = new Redacao({
  id: 1,
  content: 'test content',
  title: 'test title',
  topic: 'test topic',
  createdAt: new Date(),
  statusCorrecao: 'pendente',
  statusEnvio: 'enviado',
  updatedAt: new Date(),
  user: userEntity,
});

const redacaoCommentEntity = new RedacaoComments({
  id: 1,
  startIndex: 0,
  endIndex: 10,
  comentario: 'Test comment',
  createdAt: new Date(),
  updatedAt: new Date(),
  autor: userEntity,
  redacao: redacaoEntity,
});

const redacaoCommentsArray = [redacaoCommentEntity];

describe('GetRedacaoCommentService', () => {
  let service: GetRedacaoCommentService;
  let userRepository: Repository<User>;
  let redacaoRepository: Repository<Redacao>;
  let redacaoCommentsRepository: Repository<RedacaoComments>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetRedacaoCommentService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(userEntity),
          },
        },
        {
          provide: getRepositoryToken(Redacao),
          useValue: {
            findOne: jest.fn().mockResolvedValue(redacaoEntity),
          },
        },
        {
          provide: getRepositoryToken(RedacaoComments),
          useValue: {
            find: jest.fn().mockResolvedValue(redacaoCommentsArray),
            findOne: jest.fn().mockResolvedValue(redacaoCommentEntity),
          },
        },
      ],
    }).compile();

    service = module.get<GetRedacaoCommentService>(GetRedacaoCommentService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    redacaoRepository = module.get<Repository<Redacao>>(
      getRepositoryToken(Redacao),
    );
    redacaoCommentsRepository = module.get<Repository<RedacaoComments>>(
      getRepositoryToken(RedacaoComments),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(redacaoRepository).toBeDefined();
    expect(redacaoCommentsRepository).toBeDefined();
  });

  describe('getRedacaoComments', () => {
    it('should return all comments for a redacao', async () => {
      const result = await service.getRedacaoComments('userId', 1);

      expect(result).toEqual(redacaoCommentsArray);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'userId' },
      });
      expect(redacaoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(redacaoCommentsRepository.find).toHaveBeenCalledWith({
        where: { redacao: { id: 1 } },
        order: { startIndex: 'ASC' },
      });
    });

    it('should throw NotFoundException if autorId is not provided', async () => {
      await expect(service.getRedacaoComments('', 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.getRedacaoComments('userId', 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(redacaoRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if redacao is not found', async () => {
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.getRedacaoComments('userId', 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(redacaoCommentsRepository.find).not.toHaveBeenCalled();
    });

    it('should return empty array if no comments are found', async () => {
      jest.spyOn(redacaoCommentsRepository, 'find').mockResolvedValueOnce([]);

      const result = await service.getRedacaoComments('userId', 1);

      expect(result).toEqual([]);
    });
  });

  describe('getRedacaoCommentById', () => {
    it('should return a specific comment by id', async () => {
      const result = await service.getRedacaoCommentById('userId', 1, 1);

      expect(result).toEqual(redacaoCommentEntity);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'userId' },
      });
      expect(redacaoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(redacaoCommentsRepository.findOne).toHaveBeenCalledWith({
        where: { redacao: { id: 1 }, id: 1 },
      });
    });

    it('should throw NotFoundException if autorId is not provided', async () => {
      await expect(service.getRedacaoCommentById('', 1, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.getRedacaoCommentById('userId', 1, 1),
      ).rejects.toThrow(NotFoundException);
      expect(redacaoRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if redacao is not found', async () => {
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.getRedacaoCommentById('userId', 1, 1),
      ).rejects.toThrow(NotFoundException);
      expect(redacaoCommentsRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if comment is not found', async () => {
      jest
        .spyOn(redacaoCommentsRepository, 'findOne')
        .mockResolvedValueOnce(null);

      await expect(
        service.getRedacaoCommentById('userId', 1, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
