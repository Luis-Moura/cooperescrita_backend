import { MigrationInterface, QueryRunner } from "typeorm";

export class FixNameSuggestion1739364816587 implements MigrationInterface {
    name = 'FixNameSuggestion1739364816587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "correcao_suggestions" ("correctionSuggestionId" SERIAL NOT NULL, "startIndex" integer NOT NULL, "endIndex" integer NOT NULL, "originalText" character varying NOT NULL, "suggestionText" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "correcaoCorrecaoId" integer, CONSTRAINT "PK_57393b1852ed1ef8a75fcd185e9" PRIMARY KEY ("correctionSuggestionId"))`);
        await queryRunner.query(`ALTER TABLE "correcao_suggestions" ADD CONSTRAINT "FK_948db84c94ae5b5ec30ce6a2621" FOREIGN KEY ("correcaoCorrecaoId") REFERENCES "correcao"("correcaoId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao_suggestions" DROP CONSTRAINT "FK_948db84c94ae5b5ec30ce6a2621"`);
        await queryRunner.query(`DROP TABLE "correcao_suggestions"`);
    }

}
