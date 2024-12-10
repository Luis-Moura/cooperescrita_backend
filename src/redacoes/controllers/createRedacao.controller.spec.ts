import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createDefinitiveRedacaoDto } from '../dto/createDefinitiveRedacaoDto';
import { createDraftRedacaoDto } from '../dto/createDraftRedacaoDto';
import { CreateRedacaoService } from '../services/createRedacao.service';
import { CreateRedacaoController } from './createRedacao.controller';
import { Redacao } from '../entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';

describe('CreateRedacaoController', () => {
  let controller: CreateRedacaoController;
  let service: CreateRedacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateRedacaoController],
      providers: [
        {
          provide: CreateRedacaoService,
          useValue: {
            createDefinitiveRedacao: jest.fn(),
            createDraft: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateRedacaoController>(CreateRedacaoController);
    service = module.get<CreateRedacaoService>(CreateRedacaoService);
  });

  describe('createDefinitiveRedacao', () => {
    it('should create a definitive redacao', async () => {
      const req = { user: { userId: '1' } };
      const redacaoDto: createDefinitiveRedacaoDto = {
        title: 'Test Redacao',
        topic: 'Test Topic',
        content: 'Test Content',
      };
      const result: Redacao = {
        id: 1,
        ...redacaoDto,
        statusEnvio: 'enviado',
        statusCorrecao: 'pendente',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: new User(),
      };

      jest.spyOn(service, 'createDefinitiveRedacao').mockResolvedValue(result);

      expect(await controller.createDefinitiveRedacao(redacaoDto, req)).toBe(
        result,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      const req = { user: { userId: '1' } };
      const redacaoDto: createDefinitiveRedacaoDto = {
        title: 'Test Redacao',
        topic: 'Test Topic',
        content: 'Test Content',
      };

      jest
        .spyOn(service, 'createDefinitiveRedacao')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.createDefinitiveRedacao(redacaoDto, req),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if redacao is already sent', async () => {
      const req = { user: { userId: '1' } };
      const redacaoDto: createDefinitiveRedacaoDto = {
        title: 'Test Redacao',
        topic: 'Test Topic',
        content: 'Test Content',
      };

      jest
        .spyOn(service, 'createDefinitiveRedacao')
        .mockRejectedValue(new BadRequestException());

      await expect(
        controller.createDefinitiveRedacao(redacaoDto, req),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      const req = { user: { userId: '1' } };
      const redacaoDto: createDefinitiveRedacaoDto = {
        title: 'Test Redacao',
        topic: 'Test Topic',
        content: 'Test Content',
      };

      jest
        .spyOn(service, 'createDefinitiveRedacao')
        .mockRejectedValue(new InternalServerErrorException());

      await expect(
        controller.createDefinitiveRedacao(redacaoDto, req),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createDraft', () => {
    it('should create a draft redacao', async () => {
      const req = { user: { userId: '1' } };
      const draftDto: createDraftRedacaoDto = {
        title: 'Test Draft',
        topic: 'Test Topic',
        content: 'Test Content',
      };
      const result: Redacao = {
        id: 1,
        ...draftDto,
        statusEnvio: 'rascunho',
        statusCorrecao: 'pendente',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: new User(),
      };

      jest.spyOn(service, 'createDraft').mockResolvedValue(result);

      expect(await controller.createDraft(req, draftDto)).toBe(result);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const req = { user: { userId: '1' } };
      const draftDto: createDraftRedacaoDto = {
        title: 'Test Draft',
        topic: 'Test Topic',
        content: 'Test Content',
      };

      jest
        .spyOn(service, 'createDraft')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.createDraft(req, draftDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      const req = { user: { userId: '1' } };
      const draftDto: createDraftRedacaoDto = {
        title: 'Test Draft',
        topic: 'Test Topic',
        content: 'Test Content',
      };

      jest
        .spyOn(service, 'createDraft')
        .mockRejectedValue(new InternalServerErrorException());

      await expect(controller.createDraft(req, draftDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
