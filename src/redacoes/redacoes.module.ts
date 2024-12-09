import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateRedacaoController } from './controllers/createRedacao.controller';
import { GetRedacaoController } from './controllers/getRedacao.controller';
import { Redacao } from './entities/redacao.entity';
import { RedacoesService } from './redacoes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Redacao, User])],
  controllers: [GetRedacaoController, CreateRedacaoController],
  providers: [RedacoesService],
})
export class RedacoesModule {}
