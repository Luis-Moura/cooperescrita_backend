import { MigrationInterface, QueryRunner } from "typeorm";

export class CorrecoesNasEntidades1738020670790 implements MigrationInterface {
    name = 'CorrecoesNasEntidades1738020670790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao" DROP CONSTRAINT "FK_36907883a6f7a80597f062a91c6"`);
        await queryRunner.query(`ALTER TABLE "correcao_highlights" RENAME COLUMN "correcao" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "correcao" RENAME COLUMN "userId" TO "corretorId"`);
        await queryRunner.query(`ALTER TABLE "correcao" ADD CONSTRAINT "FK_369db54ed6e3b24696afc30671e" FOREIGN KEY ("corretorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao" DROP CONSTRAINT "FK_369db54ed6e3b24696afc30671e"`);
        await queryRunner.query(`ALTER TABLE "correcao" RENAME COLUMN "corretorId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "correcao_highlights" RENAME COLUMN "createdAt" TO "correcao"`);
        await queryRunner.query(`ALTER TABLE "correcao" ADD CONSTRAINT "FK_36907883a6f7a80597f062a91c6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
