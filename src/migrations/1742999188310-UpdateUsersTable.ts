import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsersTable1742999188310 implements MigrationInterface {
    name = 'UpdateUsersTable1742999188310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deactivatedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordChangedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordChangedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deactivatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active"`);
    }

}
