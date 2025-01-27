import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoverCorrecaoStats1712345678901 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS correcao_stats`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE correcao_stats (...)`); // Recrie a tabela se precisar de rollback
    }
}
