import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { Redacao } from '../entities/redacao.entity';
import { IOrderQuery } from '../interfaces/IOrderQuery';
import { GetRedacaoService } from '../services/getRedacao.service';
import { GetRedacaoController } from './getRedacao.controller';

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
            getRedacoes: jest
              .fn()
              .mockResolvedValue({ redacoes: redacaoEntity, totalRedacoes: 1 }),
            getRedacaoById: jest.fn().mockResolvedValue(redacaoEntity[0]),
          },
        },
      ],
    }).compile();

    controller = module.get<GetRedacaoController>(GetRedacaoController);
    service = module.get<GetRedacaoService>(GetRedacaoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getRedacoes', () => {
    it('should return an array of redacoes and total of redacoes', async () => {
      const req = { user: { userId: 'userId' } };
      const limit = 10;
      const offset = 0;
      const orderQuery: IOrderQuery = { order: 'crescente' };

      const result = await controller.getRedacoes(
        req,
        limit,
        offset,
        orderQuery,
      );

      expect(result).toEqual({ redacoes: redacaoEntity, totalRedacoes: 1 });
      expect(service.getRedacoes).toHaveBeenCalledWith(
        req.user.userId,
        limit,
        offset,
        orderQuery,
      );
      expect(service.getRedacoes).toHaveBeenCalledTimes(1);
    });

    it('should throw an NotFoundException if getRedacoes throws', async () => {
      const req = { user: { userId: 'userId' } };
      const limit = 10;
      const offset = 0;
      const orderQuery: IOrderQuery = { order: 'crescente' };

      jest
        .spyOn(service, 'getRedacoes')
        .mockRejectedValue(new NotFoundException('Test error'));

      await expect(
        controller.getRedacoes(req, limit, offset, orderQuery),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw an BadRequestException if limit or offset are invalid', async () => {
      const req = { user: { userId: 'userId' } };
      const limit = 10;
      const offset = 0;
      const orderQuery: IOrderQuery = { order: 'crescente' };

      jest
        .spyOn(service, 'getRedacoes')
        .mockRejectedValue(new BadRequestException('Test error'));

      await expect(
        controller.getRedacoes(req, limit, offset, orderQuery),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('getRedacaoById', () => {
    it('should return a redacao', async () => {
      const req = {
        user: { userId: 'userId' },
        params: { id: 1 },
      };

      const result = await controller.getRedacaoById(req);

      expect(result).toBe(redacaoEntity[0]);
      expect(service.getRedacaoById).toHaveBeenCalledWith(
        req.user.userId,
        req.params.id,
      );
      expect(service.getRedacaoById).toHaveBeenCalledTimes(1);
    });

    it('should throw an NotFoundException if getRedacaoById throws', async () => {
      const req = {
        user: { userId: 'userId' },
        params: { id: 1 },
      };

      jest
        .spyOn(service, 'getRedacaoById')
        .mockRejectedValue(new NotFoundException('Test error'));

      await expect(controller.getRedacaoById(req)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('should throw an BadRequestException if getRedacaoById throws', async () => {
      const req = {
        user: { userId: 'userId' },
        params: { id: 1 },
      };

      jest
        .spyOn(service, 'getRedacaoById')
        .mockRejectedValue(new BadRequestException('Test error'));

      await expect(controller.getRedacaoById(req)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
