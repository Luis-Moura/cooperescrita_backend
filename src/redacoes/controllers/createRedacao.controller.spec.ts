import { Test, TestingModule } from '@nestjs/testing';
import { CreateRedacaoService } from '../services/createRedacao.service';
import { CreateRedacaoController } from './createRedacao.controller';
import { createDefinitiveRedacaoDto } from '../dto/createDefinitiveRedacaoDto';
import { Redacao } from '../entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { createDraftRedacaoDto } from '../dto/createDraftRedacaoDto';

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

const redacaoEntity = [
  new Redacao({
    id: 1,
    content: 'test content',
    title: 'test title',
    topic: 'test topic',
    createdAt: new Date(),
    statusCorrecao: 'status test',
    statusEnvio: 'status test',
    updatedAt: new Date(),
    user: userEntity,
  }),
];

describe('createRedacaocontroller', () => {
  let controller: CreateRedacaoController;
  let service: CreateRedacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateRedacaoController],
      providers: [
        {
          provide: CreateRedacaoService,
          useValue: {
            createDefinitiveRedacao: jest.fn().mockResolvedValue(redacaoEntity),
            createDraft: jest.fn().mockResolvedValue(redacaoEntity),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateRedacaoController>(CreateRedacaoController);
    service = module.get<CreateRedacaoService>(CreateRedacaoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('createDefinitiveRedacao', () => {
    it('should create a new redacao and self return', async () => {
      const body: createDefinitiveRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      const req = { user: { userId: 'userId' } };

      const result = await controller.createDefinitiveRedacao(body, req);

      expect(result).toBe(redacaoEntity);
      expect(service.createDefinitiveRedacao).toHaveBeenCalledWith(
        body,
        req.user.userId,
        undefined,
      );
      expect(service.createDefinitiveRedacao).toHaveBeenCalledTimes(1);
    });

    it('should throw an NotfoundException if createDefinitiveRedacao throws', async () => {
      const body: createDefinitiveRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      const req = { user: { userId: 'userId' } };

      jest
        .spyOn(service, 'createDefinitiveRedacao')
        .mockRejectedValue(new NotFoundException('Test error'));

      await expect(
        controller.createDefinitiveRedacao(body, req),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an BadRequestException if createDefinitiveRedacao throws', async () => {
      const body: createDefinitiveRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      const req = { user: { userId: 'userId' } };

      jest
        .spyOn(service, 'createDefinitiveRedacao')
        .mockRejectedValue(new BadRequestException('Test error'));

      await expect(
        controller.createDefinitiveRedacao(body, req),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createDraftRedacao', () => {
    it('should create a new draft and self return', async () => {
      const body: createDraftRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      const req = { user: { userId: 'userId' } };

      const id = 1;

      const result = await controller.createDraft(req, body, id);

      expect(result).toBe(redacaoEntity);
      expect(service.createDraft).toHaveBeenCalledWith(
        req.user.userId,
        body,
        id,
      );
      expect(service.createDraft).toHaveBeenCalledTimes(1);
    });

    it('should throw an NotfoundException if createDraft throws', async () => {
      const body: createDraftRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      const req = { user: { userId: 'userId' } };

      const id = 1;

      jest
        .spyOn(service, 'createDraft')
        .mockRejectedValue(new NotFoundException('Test error'));

      await expect(controller.createDraft(req, body, id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an BadRequestException if createDraft throws', async () => {
      const body: createDraftRedacaoDto = {
        content: 'test content',
        title: 'test title',
        topic: 'test topic',
      };

      const req = { user: { userId: 'userId' } };

      const id = 1;

      jest
        .spyOn(service, 'createDraft')
        .mockRejectedValue(new BadRequestException('Test error'));

      await expect(controller.createDraft(req, body, id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
