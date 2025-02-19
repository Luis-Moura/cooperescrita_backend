import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionaEntidadeRedacaoComments1739964226596 implements MigrationInterface {
    name = 'AdicionaEntidadeRedacaoComments1739964226596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "redacao_comments" ("id" SERIAL NOT NULL, "startIndex" integer NOT NULL, "endIndex" integer NOT NULL, "comentario" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "autorId" uuid, "redacaoId" integer, CONSTRAINT "PK_3ff5a984c3659d07bbaa94ae2ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "redacao_comments" ADD CONSTRAINT "FK_00eef1a83a9cd4d92e52f1e2392" FOREIGN KEY ("autorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "redacao_comments" ADD CONSTRAINT "FK_b85856af4e948ad21a43cb242d1" FOREIGN KEY ("redacaoId") REFERENCES "redacao"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redacao_comments" DROP CONSTRAINT "FK_b85856af4e948ad21a43cb242d1"`);
        await queryRunner.query(`ALTER TABLE "redacao_comments" DROP CONSTRAINT "FK_00eef1a83a9cd4d92e52f1e2392"`);
        await queryRunner.query(`DROP TABLE "redacao_comments"`);
    }

}
