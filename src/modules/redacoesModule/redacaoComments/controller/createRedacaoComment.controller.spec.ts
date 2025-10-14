import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../../users/entities/user.entity';
import { Redacao } from '../../entities/redacao.entity';
import { RedacaoComments } from '../../entities/redacaoComments.entity';
import { CreateRedacaoCommentsDto } from '../dto/createRedacaoComments.dto';
import { CreateRedacaoCommentService } from '../service/createRedacaoComment.service';
import { CreateRedacaoCommentController } from './createRedacaoComment.controller';

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

const commentResponse = {
  ...redacaoCommentEntity,
  autor: 'userId',
  redacao: 1,
};

describe('CreateRedacaoCommentController', () => {
  let controller: CreateRedacaoCommentController;
  let service: CreateRedacaoCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateRedacaoCommentController],
      providers: [
        {
          provide: CreateRedacaoCommentService,
          useValue: {
            createRedacaoComments: jest.fn().mockResolvedValue(commentResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateRedacaoCommentController>(
      CreateRedacaoCommentController,
    );
    service = module.get<CreateRedacaoCommentService>(
      CreateRedacaoCommentService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('createRedacaoComments', () => {
    it('should create a new comment and return it', async () => {
      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
        color: '#FF0000',
      };

      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;

      const result = await controller.createRedacaoComments(
        req,
        dto,
        redacaoId,
      );

      expect(result).toEqual(commentResponse);
      expect(service.createRedacaoComments).toHaveBeenCalledWith(
        'userId',
        dto,
        redacaoId,
      );
      expect(service.createRedacaoComments).toHaveBeenCalledTimes(1);
    });

    it('should throw BadRequestException if redacaoId is not a number', async () => {
      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
        color: '#FF0000',
      };

      const req = { user: { userId: 'userId' } };
      const redacaoId = NaN;

      await expect(
        controller.createRedacaoComments(req, dto, redacaoId),
      ).rejects.toThrow(BadRequestException);
      expect(service.createRedacaoComments).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if redacaoId is not provided', async () => {
      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
        color: '#FF0000',
      };

      const req = { user: { userId: 'userId' } };
      const redacaoId = null;

      await expect(
        controller.createRedacaoComments(req, dto, redacaoId),
      ).rejects.toThrow(BadRequestException);
      expect(service.createRedacaoComments).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if service throws NotFoundException', async () => {
      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
        color: '#FF0000',
      };

      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;

      jest
        .spyOn(service, 'createRedacaoComments')
        .mockRejectedValueOnce(new NotFoundException('User not found'));

      await expect(
        controller.createRedacaoComments(req, dto, redacaoId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if service throws ForbiddenException', async () => {
      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
        color: '#FF0000',
      };

      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;

      jest
        .spyOn(service, 'createRedacaoComments')
        .mockRejectedValueOnce(
          new ForbiddenException('You cannot comment on a draft essay'),
        );

      await expect(
        controller.createRedacaoComments(req, dto, redacaoId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if service throws BadRequestException', async () => {
      const dto: CreateRedacaoCommentsDto = {
        startIndex: 0,
        endIndex: 10,
        comentario: 'Test comment',
        color: '#FF0000',
      };

      const req = { user: { userId: 'userId' } };
      const redacaoId = 1;

      jest
        .spyOn(service, 'createRedacaoComments')
        .mockRejectedValueOnce(
          new BadRequestException('There is already a comment on this range'),
        );

      await expect(
        controller.createRedacaoComments(req, dto, redacaoId),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
