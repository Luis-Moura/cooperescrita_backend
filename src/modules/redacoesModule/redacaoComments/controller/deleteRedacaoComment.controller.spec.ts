import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteRedacaoCommentService } from '../service/deleteRedacaoComment.service';
import { DeleteRedacaoCommentController } from './deleteRedacaoComment.controller';

const deleteResponse = { message: 'Comment deleted' };

describe('DeleteRedacaoCommentController', () => {
  let controller: DeleteRedacaoCommentController;
  let service: DeleteRedacaoCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteRedacaoCommentController],
      providers: [
        {
          provide: DeleteRedacaoCommentService,
          useValue: {
            deleteRedacaoComment: jest.fn().mockResolvedValue(deleteResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<DeleteRedacaoCommentController>(
      DeleteRedacaoCommentController,
    );
    service = module.get<DeleteRedacaoCommentService>(
      DeleteRedacaoCommentService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('deleteRedacaoComment', () => {
    it('should delete a comment and return success message', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = 1;

      const result = await controller.deleteRedacaoComment(
        req,
        redacaoId,
        commentId,
      );

      expect(result).toEqual(deleteResponse);
      expect(service.deleteRedacaoComment).toHaveBeenCalledWith(
        'userId',
        redacaoId,
        commentId,
      );
      expect(service.deleteRedacaoComment).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if commentId is not a number', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = NaN;

      await expect(
        controller.deleteRedacaoComment(req, redacaoId, commentId),
      ).rejects.toThrow(BadRequestException);
      expect(service.deleteRedacaoComment).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if commentId is not provided', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = null;

      await expect(
        controller.deleteRedacaoComment(req, redacaoId, commentId),
      ).rejects.toThrow(BadRequestException);
      expect(service.deleteRedacaoComment).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if redacaoId is not a number', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = NaN;
      const commentId = 1;

      await expect(
        controller.deleteRedacaoComment(req, redacaoId, commentId),
      ).rejects.toThrow(BadRequestException);
      expect(service.deleteRedacaoComment).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if redacaoId is not provided', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = null;
      const commentId = 1;

      await expect(
        controller.deleteRedacaoComment(req, redacaoId, commentId),
      ).rejects.toThrow(BadRequestException);
      expect(service.deleteRedacaoComment).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if service throws NotFoundException', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = 1;

      jest
        .spyOn(service, 'deleteRedacaoComment')
        .mockRejectedValueOnce(new NotFoundException('Comment not found'));

      await expect(
        controller.deleteRedacaoComment(req, redacaoId, commentId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if service throws UnauthorizedException', async () => {
      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;
      const commentId = 1;

      jest
        .spyOn(service, 'deleteRedacaoComment')
        .mockRejectedValueOnce(new UnauthorizedException('Unauthorized'));

      await expect(
        controller.deleteRedacaoComment(req, redacaoId, commentId),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
