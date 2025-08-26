import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotaAndComentarioFinalToCorrecao1756166262166 implements MigrationInterface {
    name = 'AddNotaAndComentarioFinalToCorrecao1756166262166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao" ADD "nota" integer`);
        await queryRunner.query(`ALTER TABLE "correcao" ADD "comentario_final" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao" DROP COLUMN "comentario_final"`);
        await queryRunner.query(`ALTER TABLE "correcao" DROP COLUMN "nota"`);
    }

}
