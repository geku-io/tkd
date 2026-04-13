import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeDelete1776040687895 implements MigrationInterface {
  name = 'AddCascadeDelete1776040687895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "competitions" DROP CONSTRAINT "FK_2b6e69ccdd33b2d7809d7aa9320"`,
    );
    await queryRunner.query(
      `ALTER TABLE "competitions" DROP CONSTRAINT "FK_82a163c4e3d2c928116a570b320"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournaments" ALTER COLUMN "isVisible" SET DEFAULT 'true'`,
    );
    await queryRunner.query(
      `ALTER TABLE "competitions" ALTER COLUMN "isLive" SET DEFAULT 'false'`,
    );
    await queryRunner.query(
      `ALTER TABLE "competitions" ADD CONSTRAINT "FK_2b6e69ccdd33b2d7809d7aa9320" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "competitions" ADD CONSTRAINT "FK_82a163c4e3d2c928116a570b320" FOREIGN KEY ("arena_id") REFERENCES "arenas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "competitions" DROP CONSTRAINT "FK_82a163c4e3d2c928116a570b320"`,
    );
    await queryRunner.query(
      `ALTER TABLE "competitions" DROP CONSTRAINT "FK_2b6e69ccdd33b2d7809d7aa9320"`,
    );
    await queryRunner.query(
      `ALTER TABLE "competitions" ALTER COLUMN "isLive" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournaments" ALTER COLUMN "isVisible" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "competitions" ADD CONSTRAINT "FK_82a163c4e3d2c928116a570b320" FOREIGN KEY ("arena_id") REFERENCES "arenas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "competitions" ADD CONSTRAINT "FK_2b6e69ccdd33b2d7809d7aa9320" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
