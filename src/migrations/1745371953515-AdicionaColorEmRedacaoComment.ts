import { MigrationInterface, QueryRunner } from "typeorm";

export class AdicionaColorEmRedacaoComment1745371953515 implements MigrationInterface {
    name = 'AdicionaColorEmRedacaoComment1745371953515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redacao_comments" ADD "color" character varying(7) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redacao_comments" DROP COLUMN "color"`);
    }

}
