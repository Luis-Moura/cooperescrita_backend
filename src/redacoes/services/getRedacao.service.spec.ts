import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Redacao } from 'src/redacoes/entities/redacao.entity';
import { GetRedacaoService } from 'src/redacoes/services/getRedacao.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

describe('GetRedacaoService', () => {
  let service: GetRedacaoService;
  let redacaoRepository: Repository<Redacao>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetRedacaoService,
        {
          provide: getRepositoryToken(Redacao),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            merge: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GetRedacaoService>(GetRedacaoService);
    redacaoRepository = module.get<Repository<Redacao>>(
      getRepositoryToken(Redacao),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('getRedacoes', () => {
    it('should throw NotFoundException if userId is not provided', async () => {
      await expect(service.getRedacoes('', 10, 0, {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if limit or offset is invalid', async () => {
      await expect(service.getRedacoes('userId', NaN, 0, {})).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.getRedacoes('userId', 10, NaN, {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await expect(service.getRedacoes('userId', 10, 0, {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return redacoes', async () => {
      const user = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      const redacoes = [new Redacao()];
      jest.spyOn(redacaoRepository, 'find').mockResolvedValue(redacoes);
      jest.spyOn(redacaoRepository, 'count').mockResolvedValue(1);

      const result = await service.getRedacoes('userId', 10, 0, {});
      expect(result).toEqual({ redacoes, totalRedacoes: 1 });
    });
  });

  describe('getRedacaoById', () => {
    it('should throw NotFoundException if userId is not provided', async () => {
      await expect(service.getRedacaoById('', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if id is invalid', async () => {
      await expect(service.getRedacaoById('userId', NaN)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await expect(service.getRedacaoById('userId', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if redacao is not found', async () => {
      const user = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValue(null);
      await expect(service.getRedacaoById('userId', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return redacao', async () => {
      const user = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      const redacao = new Redacao();
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValue(redacao);

      const result = await service.getRedacaoById('userId', 1);
      expect(result).toEqual(redacao);
    });
  });
});
