import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrecaoSugestions1737992501545 implements MigrationInterface {
    name = 'CorrecaoSugestions1737992501545'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "correcao_sugestions" ("correctionSugestionId" SERIAL NOT NULL, "startIndex" integer NOT NULL, "endIndex" integer NOT NULL, "originalText" character varying NOT NULL, "sugestionText" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "correcaoCorrecaoId" integer, CONSTRAINT "PK_6d03538a23faee56c94147eb0ec" PRIMARY KEY ("correctionSugestionId"))`);
        await queryRunner.query(`ALTER TABLE "correcao_sugestions" ADD CONSTRAINT "FK_71322cb99e2a886513e75be0362" FOREIGN KEY ("correcaoCorrecaoId") REFERENCES "correcao"("correcaoId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao_sugestions" DROP CONSTRAINT "FK_71322cb99e2a886513e75be0362"`);
        await queryRunner.query(`DROP TABLE "correcao_sugestions"`);
    }

}
