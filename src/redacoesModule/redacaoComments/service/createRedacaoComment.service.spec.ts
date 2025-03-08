import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Redacao } from '../../entities/redacao.entity';
import { RedacaoComments } from '../../entities/redacaoComments.entity';
import { CreateRedacaoCommentsDto } from '../dto/createRedacaoComments.dto';
import { CreateRedacaoCommentService } from './createRedacaoComment.service';

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

describe('CreateRedacaoCommentService', () => {
  let service: CreateRedacaoCommentService;
  let userRepository: Repository<User>;
  let redacaoRepository: Repository<Redacao>;
  let redacaoCommentsRepository: Repository<RedacaoComments>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRedacaoCommentService,
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
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockReturnValue(redacaoCommentEntity),
            save: jest.fn().mockResolvedValue(redacaoCommentEntity),
            count: jest.fn().mockResolvedValue(0),
          },
        },
      ],
    }).compile();

    service = module.get<CreateRedacaoCommentService>(
      CreateRedacaoCommentService,
    );
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

  describe('createRedacaoComments', () => {
    it('should create a new comment successfully', async () => {
      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
      };

      const result = await service.createRedacaoComments('userId', dto, 1);

      expect(result).toEqual({
        ...redacaoCommentEntity,
        autor: 'userId',
        redacao: 1,
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'userId' },
      });
      expect(redacaoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, user: { id: 'userId' } },
        relations: ['user'],
      });
      expect(redacaoCommentsRepository.findOne).toHaveBeenCalled();
      expect(redacaoCommentsRepository.count).toHaveBeenCalledWith({
        where: { redacao: { id: 1 } },
      });
      expect(redacaoCommentsRepository.create).toHaveBeenCalledWith({
        ...dto,
        autor: userEntity,
        redacao: redacaoEntity,
      });
      expect(redacaoCommentsRepository.save).toHaveBeenCalledWith(
        redacaoCommentEntity,
      );
    });

    it('should throw NotFoundException if autorId is not provided', async () => {
      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
      };

      await expect(service.createRedacaoComments('', dto, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
      };

      await expect(
        service.createRedacaoComments('userId', dto, 1),
      ).rejects.toThrow(NotFoundException);
      expect(redacaoRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if redacao is not found', async () => {
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValueOnce(null);

      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
      };

      await expect(
        service.createRedacaoComments('userId', dto, 1),
      ).rejects.toThrow(NotFoundException);
      expect(redacaoCommentsRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if redacao is not sent', async () => {
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValueOnce({
        ...redacaoEntity,
        statusEnvio: 'rascunho',
      });

      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
      };

      await expect(
        service.createRedacaoComments('userId', dto, 1),
      ).rejects.toThrow(ForbiddenException);
      expect(redacaoCommentsRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user does not own the redacao', async () => {
      const differentUser = new User({
        ...userEntity,
        id: 'differentUserId',
      });

      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValueOnce({
        ...redacaoEntity,
        user: differentUser,
      });

      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
      };

      await expect(
        service.createRedacaoComments('userId', dto, 1),
      ).rejects.toThrow(ForbiddenException);
      expect(redacaoCommentsRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if startIndex is greater than endIndex', async () => {
      const dto: CreateRedacaoCommentsDto = {
        startIndex: 20,
        endIndex: 10,
        comentario: 'Test comment',
      };

      await expect(
        service.createRedacaoComments('userId', dto, 1),
      ).rejects.toThrow(BadRequestException);
      expect(redacaoCommentsRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if there is already a comment in the range', async () => {
      jest
        .spyOn(redacaoCommentsRepository, 'findOne')
        .mockResolvedValueOnce(redacaoCommentEntity);

      const dto: CreateRedacaoCommentsDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Test comment',
      };

      await expect(
        service.createRedacaoComments('userId', dto, 1),
      ).rejects.toThrow(BadRequestException);
      expect(redacaoCommentsRepository.count).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if maximum number of comments is reached', async () => {
      jest.spyOn(redacaoCommentsRepository, 'count').mockResolvedValueOnce(15);

      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
      };

      await expect(
        service.createRedacaoComments('userId', dto, 1),
      ).rejects.toThrow(BadRequestException);
      expect(redacaoCommentsRepository.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      jest
        .spyOn(redacaoCommentsRepository, 'save')
        .mockRejectedValueOnce(new Error('Save failed'));

      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
      };

      await expect(
        service.createRedacaoComments('userId', dto, 1),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
