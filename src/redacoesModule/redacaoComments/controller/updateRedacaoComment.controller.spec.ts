import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../../users/entities/user.entity';
import { Redacao } from '../../entities/redacao.entity';
import { RedacaoComments } from '../../entities/redacaoComments.entity';
import { UpdateRedacaoCommentDto } from '../dto/updateRedacaoComment.dto';
import { UpdateRedacaoCommentService } from '../service/updateRedacaoComment.service';
import { UpdateRedacaoCommentController } from './updateRedacaoComment.controller';

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

const updateResponse = {
  ...redacaoCommentEntity,
  autor: 'userId',
  redacaoId: 1,
};

describe('UpdateRedacaoCommentController', () => {
  let controller: UpdateRedacaoCommentController;
  let service: UpdateRedacaoCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateRedacaoCommentController],
      providers: [
        {
          provide: UpdateRedacaoCommentService,
          useValue: {
            updateRedacaoComment: jest.fn().mockResolvedValue(updateResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<UpdateRedacaoCommentController>(
      UpdateRedacaoCommentController,
    );
    service = module.get<UpdateRedacaoCommentService>(
      UpdateRedacaoCommentService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('updateRedacaoComment', () => {
    it('should update a comment and return it', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = 1;
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      const result = await controller.updateRedacaoComment(
        req,
        redacaoId,
        commentId,
        updateDto,
      );

      expect(result).toEqual(updateResponse);
      expect(service.updateRedacaoComment).toHaveBeenCalledWith(
        'userId',
        redacaoId,
        commentId,
        updateDto,
      );
      expect(service.updateRedacaoComment).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if commentId is not a number', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = NaN;
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      await expect(
        controller.updateRedacaoComment(req, redacaoId, commentId, updateDto),
      ).rejects.toThrow(BadRequestException);
      expect(service.updateRedacaoComment).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if commentId is not provided', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = null;
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      await expect(
        controller.updateRedacaoComment(req, redacaoId, commentId, updateDto),
      ).rejects.toThrow(BadRequestException);
      expect(service.updateRedacaoComment).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if redacaoId is not a number', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = NaN;
      const commentId = 1;
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      await expect(
        controller.updateRedacaoComment(req, redacaoId, commentId, updateDto),
      ).rejects.toThrow(BadRequestException);
      expect(service.updateRedacaoComment).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if redacaoId is not provided', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = null;
      const commentId = 1;
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      await expect(
        controller.updateRedacaoComment(req, redacaoId, commentId, updateDto),
      ).rejects.toThrow(BadRequestException);
      expect(service.updateRedacaoComment).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if service throws NotFoundException', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = 1;
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      jest
        .spyOn(service, 'updateRedacaoComment')
        .mockRejectedValueOnce(new NotFoundException('Comment not found'));

      await expect(
        controller.updateRedacaoComment(req, redacaoId, commentId, updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if service throws UnauthorizedException', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = 1;
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 5,
        endIndex: 15,
        comentario: 'Updated comment',
      };

      jest
        .spyOn(service, 'updateRedacaoComment')
        .mockRejectedValueOnce(new UnauthorizedException('Unauthorized'));

      await expect(
        controller.updateRedacaoComment(req, redacaoId, commentId, updateDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if service throws BadRequestException', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = 1;
      const updateDto: UpdateRedacaoCommentDto = {
        startIndex: 15,
        endIndex: 5,
        comentario: 'Updated comment',
      };

      jest
        .spyOn(service, 'updateRedacaoComment')
        .mockRejectedValueOnce(new BadRequestException('Invalid indexes'));

      await expect(
        controller.updateRedacaoComment(req, redacaoId, commentId, updateDto),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
