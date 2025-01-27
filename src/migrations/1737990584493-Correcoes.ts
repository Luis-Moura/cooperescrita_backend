import { MigrationInterface, QueryRunner } from "typeorm";

export class Correcoes1737990584493 implements MigrationInterface {
    name = 'Correcoes1737990584493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "correcao_comments" ("correcaoCommentId" SERIAL NOT NULL, "comment" character varying(500) NOT NULL, "startIndex" integer NOT NULL, "endIndex" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "correcaoCorrecaoId" integer, CONSTRAINT "PK_2ce334574d1f71fb2f31387842a" PRIMARY KEY ("correcaoCommentId"))`);
        await queryRunner.query(`ALTER TABLE "correcao_comments" ADD CONSTRAINT "FK_589460dcf064ba83cb0171197e0" FOREIGN KEY ("correcaoCorrecaoId") REFERENCES "correcao"("correcaoId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao_comments" DROP CONSTRAINT "FK_589460dcf064ba83cb0171197e0"`);
        await queryRunner.query(`DROP TABLE "correcao_comments"`);
    }

}
