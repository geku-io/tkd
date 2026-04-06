import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCompetition1775418422662 implements MigrationInterface {
  name = 'ChangeCompetition1775418422662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "competitions" ADD "isLive" boolean NOT NULL DEFAULT 'false'`,
    );
    await queryRunner.query(`ALTER TABLE "competitions" ADD "startTime" TIME`);
    await queryRunner.query(
      `ALTER TABLE "tournaments" ALTER COLUMN "isVisible" SET DEFAULT 'true'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournaments" ALTER COLUMN "isVisible" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "competitions" DROP COLUMN "startTime"`,
    );
    await queryRunner.query(`ALTER TABLE "competitions" DROP COLUMN "isLive"`);
  }
}
