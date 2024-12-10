import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IOrderQuery } from '../interfaces/IOrderQuery';
import { GetRedacaoService } from '../services/getRedacao.service';
import { GetRedacaoController } from './getRedacao.controller';
import { Redacao } from '../entities/redacao.entity';
import { User } from 'src/users/entities/user.entity';

describe('GetRedacaoController', () => {
  let controller: GetRedacaoController;
  let service: GetRedacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetRedacaoController],
      providers: [
        {
          provide: GetRedacaoService,
          useValue: {
            getRedacoes: jest.fn(),
            getRedacaoById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GetRedacaoController>(GetRedacaoController);
    service = module.get<GetRedacaoService>(GetRedacaoService);
  });

  describe('getRedacoes', () => {
    it('should return redacoes with valid parameters', async () => {
      const req = { user: { userId: '1' } };
      const limit = 10;
      const offset = 0;
      const orderQuery: IOrderQuery = { order: 'crescente' };
      const result: Redacao[] = [
        {
          id: 1,
          title: 'Test Redacao',
          topic: 'Test Topic',
          content: 'Test Content',
          statusEnvio: 'rascunho',
          statusCorrecao: 'pendente',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: new User(),
        },
      ];

      jest
        .spyOn(service, 'getRedacoes')
        .mockResolvedValue({ redacoes: result, totalRedacoes: 1 });

      expect(
        await controller.getRedacoes(req, limit, offset, orderQuery),
      ).toStrictEqual({ redacoes: result, totalRedacoes: 1 });
    });

    it('should limit the number of redacoes to 50', async () => {
      const req = { user: { userId: '1' } };
      const limit = 100;
      const offset = 0;
      const orderQuery: IOrderQuery = { order: 'crescente' };
      const result: Redacao[] = [
        {
          id: 1,
          title: 'Test Redacao',
          topic: 'Test Topic',
          content: 'Test Content',
          statusEnvio: 'rascunho',
          statusCorrecao: 'pendente',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: new User(),
        },
      ];

      jest
        .spyOn(service, 'getRedacoes')
        .mockResolvedValue({ redacoes: result, totalRedacoes: 1 });

      expect(
        await controller.getRedacoes(req, limit, offset, orderQuery),
      ).toStrictEqual({ redacoes: result, totalRedacoes: 1 });
      expect(service.getRedacoes).toHaveBeenCalledWith(
        '1',
        50,
        offset,
        orderQuery,
      );
    });
  });

  describe('getRedacaoById', () => {
    it('should return a redacao by id', async () => {
      const req = { user: { userId: '1' }, params: { id: '1' } };
      const result: Redacao = {
        id: 1,
        title: 'Test Redacao',
        topic: 'Test Topic',
        content: 'Test Content',
        statusEnvio: 'rascunho',
        statusCorrecao: 'pendente',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: new User(),
      };

      jest.spyOn(service, 'getRedacaoById').mockResolvedValue(result);

      expect(await controller.getRedacaoById(req)).toBe(result);
    });

    it('should throw NotFoundException if redacao is not found', async () => {
      const req = { user: { userId: '1' }, params: { id: '1' } };

      jest
        .spyOn(service, 'getRedacaoById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.getRedacaoById(req)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
