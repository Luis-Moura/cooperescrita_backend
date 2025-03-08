import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Redacao } from '../../entities/redacao.entity';
import { RedacaoComments } from '../../entities/redacaoComments.entity';
import { UpdateRedacaoCommentDto } from '../dto/updateRedacaoComment.dto';
import { UpdateRedacaoCommentService } from './updateRedacaoComment.service';

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

describe('UpdateRedacaoCommentService', () => {
  let service: UpdateRedacaoCommentService;
  let userRepository: Repository<User>;
  let redacaoRepository: Repository<Redacao>;
  let redacaoCommentsRepository: Repository<RedacaoComments>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateRedacaoCommentService,
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
            findOne: jest.fn().mockResolvedValue(redacaoCommentEntity),
            save: jest.fn().mockResolvedValue(redacaoCommentEntity),
          },
        },
      ],
    }).compile();

    service = module.get<UpdateRedacaoCommentService>(
      UpdateRedacaoCommentService,
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

  describe('updateRedacaoComment', () => {
    it('should update a comment successfully', async () => {
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      const result = await service.updateRedacaoComment(
        'userId',
        1,
        1,
        updateDto,
      );

      expect(result).toEqual({
        ...redacaoCommentEntity,
        autor: 'userId',
        redacaoId: 1,
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'userId' },
      });
      expect(redacaoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(redacaoCommentsRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['autor'],
      });
      expect(redacaoCommentsRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if autorId is not provided', async () => {
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      await expect(
        service.updateRedacaoComment('', 1, 1, updateDto),
      ).rejects.toThrow(NotFoundException);
      expect(userRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      await expect(
        service.updateRedacaoComment('userId', 1, 1, updateDto),
      ).rejects.toThrow(NotFoundException);
      expect(redacaoRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if redacao is not found', async () => {
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValueOnce(null);

      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      await expect(
        service.updateRedacaoComment('userId', 1, 1, updateDto),
      ).rejects.toThrow(NotFoundException);
      expect(redacaoCommentsRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if comment is not found', async () => {
      jest
        .spyOn(redacaoCommentsRepository, 'findOne')
        .mockResolvedValueOnce(null);

      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      await expect(
        service.updateRedacaoComment('userId', 1, 1, updateDto),
      ).rejects.toThrow(NotFoundException);
      expect(redacaoCommentsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if comment has no author', async () => {
      jest.spyOn(redacaoCommentsRepository, 'findOne').mockResolvedValueOnce({
        ...redacaoCommentEntity,
        autor: null,
      });

      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      await expect(
        service.updateRedacaoComment('userId', 1, 1, updateDto),
      ).rejects.toThrow(UnauthorizedException);
      expect(redacaoCommentsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user is not the author', async () => {
      const differentUser = new User({
        ...userEntity,
        id: 'differentUserId',
      });

      jest.spyOn(redacaoCommentsRepository, 'findOne').mockResolvedValueOnce({
        ...redacaoCommentEntity,
        autor: differentUser,
      });

      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      await expect(
        service.updateRedacaoComment('userId', 1, 1, updateDto),
      ).rejects.toThrow(UnauthorizedException);
      expect(redacaoCommentsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if startIndex is greater than endIndex', async () => {
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 15,
        endIndex: 5,
        comentario: 'Updated comment',
      };

      await expect(
        service.updateRedacaoComment('userId', 1, 1, updateDto),
      ).rejects.toThrow(BadRequestException);
      expect(redacaoCommentsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if new startIndex is greater than original endIndex', async () => {
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 20,
        endIndex: 25,
        comentario: 'Updated comment',
      };

      await expect(
        service.updateRedacaoComment('userId', 1, 1, updateDto),
      ).rejects.toThrow(BadRequestException);
      expect(redacaoCommentsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if new endIndex is less than original startIndex', async () => {
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: -5,
        endIndex: -1,
        comentario: 'Updated comment',
      };

      await expect(
        service.updateRedacaoComment('userId', 1, 1, updateDto),
      ).rejects.toThrow(BadRequestException);
      expect(redacaoCommentsRepository.save).not.toHaveBeenCalled();
    });
  });
});
