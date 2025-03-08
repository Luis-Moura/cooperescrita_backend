import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Redacao } from '../../entities/redacao.entity';
import { RedacaoComments } from '../../entities/redacaoComments.entity';
import { DeleteRedacaoCommentService } from './deleteRedacaoComment.service';

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

describe('DeleteRedacaoCommentService', () => {
  let service: DeleteRedacaoCommentService;
  let userRepository: Repository<User>;
  let redacaoRepository: Repository<Redacao>;
  let redacaoCommentsRepository: Repository<RedacaoComments>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteRedacaoCommentService,
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
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<DeleteRedacaoCommentService>(
      DeleteRedacaoCommentService,
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

  describe('deleteRedacaoComment', () => {
    it('should delete a comment successfully', async () => {
      const result = await service.deleteRedacaoComment('userId', 1, 1);

      expect(result).toEqual({ message: 'Comment deleted' });
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
      expect(redacaoCommentsRepository.remove).toHaveBeenCalledWith(
        redacaoCommentEntity,
      );
    });

    it('should throw NotFoundException if autorId is not provided', async () => {
      await expect(service.deleteRedacaoComment('', 1, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.deleteRedacaoComment('userId', 1, 1),
      ).rejects.toThrow(NotFoundException);
      expect(redacaoRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if redacao is not found', async () => {
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.deleteRedacaoComment('userId', 1, 1),
      ).rejects.toThrow(NotFoundException);
      expect(redacaoCommentsRepository.findOne).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if comment is not found', async () => {
      jest
        .spyOn(redacaoCommentsRepository, 'findOne')
        .mockResolvedValueOnce(null);

      await expect(
        service.deleteRedacaoComment('userId', 1, 1),
      ).rejects.toThrow(NotFoundException);
      expect(redacaoCommentsRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if comment author is not the same as the requester', async () => {
      const differentUser = new User({
        ...userEntity,
        id: 'differentUserId',
      });

      jest.spyOn(redacaoCommentsRepository, 'findOne').mockResolvedValueOnce({
        ...redacaoCommentEntity,
        autor: differentUser,
      });

      await expect(
        service.deleteRedacaoComment('userId', 1, 1),
      ).rejects.toThrow(UnauthorizedException);
      expect(redacaoCommentsRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if comment has no author', async () => {
      jest.spyOn(redacaoCommentsRepository, 'findOne').mockResolvedValueOnce({
        ...redacaoCommentEntity,
        autor: null,
      });

      await expect(
        service.deleteRedacaoComment('userId', 1, 1),
      ).rejects.toThrow(UnauthorizedException);
      expect(redacaoCommentsRepository.remove).not.toHaveBeenCalled();
    });
  });
});
