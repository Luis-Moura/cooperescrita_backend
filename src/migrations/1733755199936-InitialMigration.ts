import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1733755199936 implements MigrationInterface {
  name = 'InitialMigration1733755199936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "redacao" ("id" SERIAL NOT NULL, "title" character varying(200), "topic" character varying(200) NOT NULL, "content" text NOT NULL, "statusEnvio" "public"."redacao_statusenvio_enum" NOT NULL DEFAULT 'rascunho', "statusCorrecao" "public"."redacao_statuscorrecao_enum" NOT NULL DEFAULT 'nao_corrigida', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_7acdfee72215a16b314a4c0a15d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying(100) NOT NULL, "verified" boolean NOT NULL DEFAULT false, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "twoFA" boolean DEFAULT false, "failedLoginAttempts" integer NOT NULL DEFAULT '0', "lockUntil" TIMESTAMP, "verificationCode" character varying(100), "verificationCodeExpires" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "redacao" ADD CONSTRAINT "FK_bfda782531963b4c5dc002c9963" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "redacao" DROP CONSTRAINT "FK_bfda782531963b4c5dc002c9963"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "redacao"`);
  }
}
