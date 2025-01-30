import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrecaoStatusEnvio1738152011546 implements MigrationInterface {
    name = 'CorrecaoStatusEnvio1738152011546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."correcao_statusenvio_enum" AS ENUM('rascunho', 'enviado')`);
        await queryRunner.query(`ALTER TABLE "correcao" ADD "statusEnvio" "public"."correcao_statusenvio_enum" NOT NULL DEFAULT 'rascunho'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao" DROP COLUMN "statusEnvio"`);
        await queryRunner.query(`DROP TYPE "public"."correcao_statusenvio_enum"`);
    }

}
