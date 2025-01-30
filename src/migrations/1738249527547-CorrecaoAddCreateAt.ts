import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrecaoAddCreateAt1738249527547 implements MigrationInterface {
    name = 'CorrecaoAddCreateAt1738249527547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao" DROP COLUMN "createdAt"`);
    }

}
