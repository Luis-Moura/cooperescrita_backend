import { Test, TestingModule } from '@nestjs/testing';
import { DeleteRedacaoController } from './deleteRedacao.controller';
import { DeleteRedacaoService } from '../services/deleteRedacao.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('deleteRedacaoController', () => {
  let controller: DeleteRedacaoController;
  let service: DeleteRedacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteRedacaoController],
      providers: [
        {
          provide: DeleteRedacaoService,
          useValue: {
            deleteRedacaoById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<DeleteRedacaoController>(DeleteRedacaoController);
    service = module.get<DeleteRedacaoService>(DeleteRedacaoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('deleteRedacaoById', () => {
    it('should return a Promise of void', async () => {
      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          id: 1,
        },
      };

      const result = await controller.deleteRedacaoById(req);

      expect(result).toBeUndefined();
      expect(service.deleteRedacaoById).toHaveBeenCalledWith(
        req.user.userId,
        req.params.id,
      );
      expect(service.deleteRedacaoById).toHaveBeenCalledTimes(1);
    });

    it('should throw an NotFoundException if deleteRedacaoById throws', async () => {
      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          id: 1,
        },
      };

      jest
        .spyOn(service, 'deleteRedacaoById')
        .mockRejectedValue(new NotFoundException('Test error'));

      await expect(controller.deleteRedacaoById(req)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an BadRequestException if deleteRedacaoById throws', async () => {
      const req = {
        user: {
          userId: 'userId',
        },
        params: {
          id: 1,
        },
      };

      jest
        .spyOn(service, 'deleteRedacaoById')
        .mockRejectedValue(new BadRequestException('Test error'));

      await expect(controller.deleteRedacaoById(req)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
