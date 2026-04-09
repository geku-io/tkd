import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVisibilityToTournaments1775408344884
  implements MigrationInterface
{
  name = 'AddVisibilityToTournaments1775408344884';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournaments" ADD "isVisible" boolean NOT NULL DEFAULT 'true'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tournaments" DROP COLUMN "isVisible"`,
    );
  }
}
