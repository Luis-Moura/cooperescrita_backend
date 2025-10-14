import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Redacao } from '../../entities/redacao.entity';
import { User } from '../../../users/entities/user.entity';
import { RedacaoComments } from '../../entities/redacaoComments.entity';
import { GetRedacaoCommentService } from '../service/getRedacaoComment.service';
import { GetRedacaoCommentsController } from './getRedacaoComment.controller';

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
  color: '#FF0000',
  createdAt: new Date(),
  updatedAt: new Date(),
  autor: userEntity,
  redacao: redacaoEntity,
});

const redacaoCommentsArray = [redacaoCommentEntity];

describe('GetRedacaoCommentsController', () => {
  let controller: GetRedacaoCommentsController;
  let service: GetRedacaoCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetRedacaoCommentsController],
      providers: [
        {
          provide: GetRedacaoCommentService,
          useValue: {
            getRedacaoComments: jest
              .fn()
              .mockResolvedValue(redacaoCommentsArray),
            getRedacaoCommentById: jest
              .fn()
              .mockResolvedValue(redacaoCommentEntity),
          },
        },
      ],
    }).compile();

    controller = module.get<GetRedacaoCommentsController>(
      GetRedacaoCommentsController,
    );
    service = module.get<GetRedacaoCommentService>(GetRedacaoCommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getRedacaoComments', () => {
    it('should return an array of comments for a redacao', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;

      const result = await controller.getRedacaoComments(req, redacaoId);

      expect(result).toEqual(redacaoCommentsArray);
      expect(service.getRedacaoComments).toHaveBeenCalledWith(
        'userId',
        redacaoId,
      );
      expect(service.getRedacaoComments).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if redacaoId is not a number', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = NaN;

      await expect(
        controller.getRedacaoComments(req, redacaoId),
      ).rejects.toThrow(BadRequestException);
      expect(service.getRedacaoComments).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if redacaoId is not provided', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = null;

      await expect(
        controller.getRedacaoComments(req, redacaoId),
      ).rejects.toThrow(BadRequestException);
      expect(service.getRedacaoComments).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if service throws NotFoundException', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;

      jest
        .spyOn(service, 'getRedacaoComments')
        .mockRejectedValueOnce(new NotFoundException('Essay not found'));

      await expect(
        controller.getRedacaoComments(req, redacaoId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getRedacaoCommentById', () => {
    it('should return a specific comment by id', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = 1;

      const result = await controller.getRedacaoCommentById(
        req,
        redacaoId,
        commentId,
      );

      expect(result).toEqual(redacaoCommentEntity);
      expect(service.getRedacaoCommentById).toHaveBeenCalledWith(
        'userId',
        redacaoId,
        commentId,
      );
      expect(service.getRedacaoCommentById).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if commentId is not a number', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = NaN;

      await expect(
        controller.getRedacaoCommentById(req, redacaoId, commentId),
      ).rejects.toThrow(BadRequestException);
      expect(service.getRedacaoCommentById).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if commentId is not provided', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = null;

      await expect(
        controller.getRedacaoCommentById(req, redacaoId, commentId),
      ).rejects.toThrow(BadRequestException);
      expect(service.getRedacaoCommentById).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if redacaoId is not a number', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = NaN;
      const commentId = 1;

      await expect(
        controller.getRedacaoCommentById(req, redacaoId, commentId),
      ).rejects.toThrow(BadRequestException);
      expect(service.getRedacaoCommentById).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if redacaoId is not provided', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = null;
      const commentId = 1;

      await expect(
        controller.getRedacaoCommentById(req, redacaoId, commentId),
      ).rejects.toThrow(BadRequestException);
      expect(service.getRedacaoCommentById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if service throws NotFoundException', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = 1;

      jest
        .spyOn(service, 'getRedacaoCommentById')
        .mockRejectedValueOnce(new NotFoundException('Comment not found'));

      await expect(
        controller.getRedacaoCommentById(req, redacaoId, commentId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
