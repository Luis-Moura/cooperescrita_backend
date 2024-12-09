import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { createDefinitiveRedacaoDto } from '../dto/createDefinitiveRedacaoDto';
import { createDraftRedacaoDto } from '../dto/createDraftRedacaoDto';
import { Redacao } from '../entities/redacao.entity';
import { CreateRedacaoService } from './createRedacao.service';

describe('CreateRedacaoService', () => {
  let service: CreateRedacaoService;
  let redacaoRepository: Repository<Redacao>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRedacaoService,
        {
          provide: getRepositoryToken(Redacao),
          useValue: {
            create: jest.fn(), // Adiciona o mock do método create
            save: jest.fn(), // Adiciona o mock do método save
            findOne: jest.fn(), // Adiciona o mock do método findOne
            merge: jest.fn(), // Adiciona o mock do método merge
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateRedacaoService>(CreateRedacaoService);
    redacaoRepository = module.get<Repository<Redacao>>(
      getRepositoryToken(Redacao),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createDefinitiveRedacao', () => {
    it('should throw NotFoundException if userId is not provided', async () => {
      await expect(
        service.createDefinitiveRedacao({} as createDefinitiveRedacaoDto, ''),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.createDefinitiveRedacao({} as createDefinitiveRedacaoDto, '1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if redacao is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);
      jest.spyOn(redacaoRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.createDefinitiveRedacao(
          {} as createDefinitiveRedacaoDto,
          '1',
          1,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if redacao is already sent', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);
      jest
        .spyOn(redacaoRepository, 'findOne')
        .mockResolvedValue({ statusEnvio: 'enviado' } as Redacao);
      await expect(
        service.createDefinitiveRedacao(
          {} as createDefinitiveRedacaoDto,
          '1',
          1,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should save a new redacao if redacaoId is not provided', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);
      jest.spyOn(redacaoRepository, 'create').mockReturnValue({} as Redacao);
      jest.spyOn(redacaoRepository, 'save').mockResolvedValue({} as Redacao);

      await expect(
        service.createDefinitiveRedacao({} as createDefinitiveRedacaoDto, '1'),
      ).resolves.toEqual({});
    });

    it('should merge and save an existing redacao if redacaoId is provided', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);
      jest
        .spyOn(redacaoRepository, 'findOne')
        .mockResolvedValue({ statusEnvio: 'rascunho' } as Redacao);
      jest.spyOn(redacaoRepository, 'merge').mockReturnValue({} as Redacao);
      jest.spyOn(redacaoRepository, 'save').mockResolvedValue({} as Redacao);

      await expect(
        service.createDefinitiveRedacao(
          {} as createDefinitiveRedacaoDto,
          '1',
          1,
        ),
      ).resolves.toEqual({});
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);
      jest
        .spyOn(redacaoRepository, 'save')
        .mockRejectedValue(new Error('Save failed'));

      await expect(
        service.createDefinitiveRedacao({} as createDefinitiveRedacaoDto, '1'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createDraft', () => {
    it('should throw NotFoundException if userId is not provided', async () => {
      await expect(
        service.createDraft('', {} as createDraftRedacaoDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.createDraft('1', {} as createDraftRedacaoDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should save a new draft redacao', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);
      jest.spyOn(redacaoRepository, 'create').mockReturnValue({} as Redacao);
      jest.spyOn(redacaoRepository, 'save').mockResolvedValue({} as Redacao);

      await expect(
        service.createDraft('1', {} as createDraftRedacaoDto),
      ).resolves.toEqual({});
    });

    it('should throw InternalServerErrorException if save fails', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);
      jest
        .spyOn(redacaoRepository, 'save')
        .mockRejectedValue(new Error('Save failed'));

      await expect(
        service.createDraft('1', {} as createDraftRedacaoDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
