import { MigrationInterface, QueryRunner } from "typeorm";

export class ReportMigration1750076469387 implements MigrationInterface {
    name = 'ReportMigration1750076469387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."redacao_report_motivo_enum" AS ENUM('conteudo_inadequado', 'spam', 'plagio', 'ofensivo', 'outro')`);
        await queryRunner.query(`CREATE TYPE "public"."redacao_report_status_enum" AS ENUM('pendente', 'analisado', 'rejeitado')`);
        await queryRunner.query(`CREATE TABLE "redacao_report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "motivo" "public"."redacao_report_motivo_enum" NOT NULL, "descricao" character varying(500), "status" "public"."redacao_report_status_enum" NOT NULL DEFAULT 'pendente', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "reportedById" uuid, "redacaoId" integer, CONSTRAINT "PK_b17e7351866138fefd34ea26e87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."correcao_report_motivo_enum" AS ENUM('conteudo_inadequado', 'spam', 'plagio', 'ofensivo', 'outro')`);
        await queryRunner.query(`CREATE TYPE "public"."correcao_report_status_enum" AS ENUM('pendente', 'analisado', 'rejeitado')`);
        await queryRunner.query(`CREATE TABLE "correcao_report" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "motivo" "public"."correcao_report_motivo_enum" NOT NULL, "descricao" character varying(500), "status" "public"."correcao_report_status_enum" NOT NULL DEFAULT 'pendente', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "reportedById" uuid, "correcaoCorrecaoId" integer, CONSTRAINT "PK_27736fa7a76d06a51a37446af58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "redacao_report" ADD CONSTRAINT "FK_33d2e55ba9ed52b2c9e9fbab158" FOREIGN KEY ("reportedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "redacao_report" ADD CONSTRAINT "FK_22a896c1be51f1490792b28e5fc" FOREIGN KEY ("redacaoId") REFERENCES "redacao"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "correcao_report" ADD CONSTRAINT "FK_526105d0fe72be7eff0bd84465d" FOREIGN KEY ("reportedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "correcao_report" ADD CONSTRAINT "FK_b1282da934537b8ec4072f6dbd3" FOREIGN KEY ("correcaoCorrecaoId") REFERENCES "correcao"("correcaoId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao_report" DROP CONSTRAINT "FK_b1282da934537b8ec4072f6dbd3"`);
        await queryRunner.query(`ALTER TABLE "correcao_report" DROP CONSTRAINT "FK_526105d0fe72be7eff0bd84465d"`);
        await queryRunner.query(`ALTER TABLE "redacao_report" DROP CONSTRAINT "FK_22a896c1be51f1490792b28e5fc"`);
        await queryRunner.query(`ALTER TABLE "redacao_report" DROP CONSTRAINT "FK_33d2e55ba9ed52b2c9e9fbab158"`);
        await queryRunner.query(`DROP TABLE "correcao_report"`);
        await queryRunner.query(`DROP TYPE "public"."correcao_report_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."correcao_report_motivo_enum"`);
        await queryRunner.query(`DROP TABLE "redacao_report"`);
        await queryRunner.query(`DROP TYPE "public"."redacao_report_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."redacao_report_motivo_enum"`);
    }

}
