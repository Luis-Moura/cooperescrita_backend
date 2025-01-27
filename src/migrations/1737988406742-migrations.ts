import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1737988406742 implements MigrationInterface {
    name = 'Migrations1737988406742'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "correcao" ("correcaoId" SERIAL NOT NULL, "userId" uuid, "redacaoId" integer, CONSTRAINT "PK_2e2b17f2236b33d85b89ea277e4" PRIMARY KEY ("correcaoId"))`);
        await queryRunner.query(`ALTER TABLE "correcao" ADD CONSTRAINT "FK_36907883a6f7a80597f062a91c6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "correcao" ADD CONSTRAINT "FK_98f10aa542f28ee2c7886ae1f1e" FOREIGN KEY ("redacaoId") REFERENCES "redacao"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao" DROP CONSTRAINT "FK_98f10aa542f28ee2c7886ae1f1e"`);
        await queryRunner.query(`ALTER TABLE "correcao" DROP CONSTRAINT "FK_36907883a6f7a80597f062a91c6"`);
        await queryRunner.query(`DROP TABLE "correcao"`);
    }

}
