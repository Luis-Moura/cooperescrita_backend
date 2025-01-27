import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrecaoHighLights1737991727370 implements MigrationInterface {
    name = 'CorrecaoHighLights1737991727370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "correcao_highlights" ("correcaoHighlightId" SERIAL NOT NULL, "startIndex" integer NOT NULL, "endIndex" integer NOT NULL, "color" character varying(10) NOT NULL, "correcao" TIMESTAMP NOT NULL DEFAULT now(), "correcaoCorrecaoId" integer, CONSTRAINT "PK_830fbe72e6ace3c602a11044fa1" PRIMARY KEY ("correcaoHighlightId"))`);
        await queryRunner.query(`ALTER TABLE "correcao_highlights" ADD CONSTRAINT "FK_10095a52c61e9fdde0d6d97b4d2" FOREIGN KEY ("correcaoCorrecaoId") REFERENCES "correcao"("correcaoId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao_highlights" DROP CONSTRAINT "FK_10095a52c61e9fdde0d6d97b4d2"`);
        await queryRunner.query(`DROP TABLE "correcao_highlights"`);
    }

}
