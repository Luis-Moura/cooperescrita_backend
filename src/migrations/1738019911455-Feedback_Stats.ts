import { MigrationInterface, QueryRunner } from "typeorm";

export class FeedbackStats1738019911455 implements MigrationInterface {
    name = 'FeedbackStats1738019911455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."correcao_feedback_feedbacktype_enum" AS ENUM('like', 'dislike')`);
        await queryRunner.query(`CREATE TABLE "correcao_feedback" ("correcaoFeedbackId" SERIAL NOT NULL, "feedbackType" "public"."correcao_feedback_feedbacktype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "correcaoCorrecaoId" integer, "userId" uuid, CONSTRAINT "PK_f891c5d0f37d19904b928c97adb" PRIMARY KEY ("correcaoFeedbackId"))`);
        await queryRunner.query(`CREATE TABLE "correcao_stats" ("correcaoStatsId" SERIAL NOT NULL, "totalLikes" integer NOT NULL DEFAULT '0', "totalDislikes" integer NOT NULL DEFAULT '0', "correcaoCorrecaoId" integer, CONSTRAINT "PK_bce6fd502f37077887c403cc659" PRIMARY KEY ("correcaoStatsId"))`);
        await queryRunner.query(`ALTER TABLE "correcao_feedback" ADD CONSTRAINT "FK_9eae32042763a9603462f5d0deb" FOREIGN KEY ("correcaoCorrecaoId") REFERENCES "correcao"("correcaoId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "correcao_feedback" ADD CONSTRAINT "FK_18896f37cc48a31bd4425f383db" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "correcao_stats" ADD CONSTRAINT "FK_84ba9541424276336ad9aab6d6f" FOREIGN KEY ("correcaoCorrecaoId") REFERENCES "correcao"("correcaoId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "correcao_stats" DROP CONSTRAINT "FK_84ba9541424276336ad9aab6d6f"`);
        await queryRunner.query(`ALTER TABLE "correcao_feedback" DROP CONSTRAINT "FK_18896f37cc48a31bd4425f383db"`);
        await queryRunner.query(`ALTER TABLE "correcao_feedback" DROP CONSTRAINT "FK_9eae32042763a9603462f5d0deb"`);
        await queryRunner.query(`DROP TABLE "correcao_stats"`);
        await queryRunner.query(`DROP TABLE "correcao_feedback"`);
        await queryRunner.query(`DROP TYPE "public"."correcao_feedback_feedbacktype_enum"`);
    }

}
