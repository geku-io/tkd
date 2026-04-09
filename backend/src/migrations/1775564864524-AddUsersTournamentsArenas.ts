import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsersTournamentsArenas1775564864524
  implements MigrationInterface
{
  name = 'AddUsersTournamentsArenas1775564864524';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_tournaments_arena" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "tournamentsArenaId" uuid, CONSTRAINT "PK_f3781f7af82a8bc1e6ce5cdb93e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournaments" ALTER COLUMN "isVisible" SET DEFAULT 'true'`,
    );
    await queryRunner.query(
      `ALTER TABLE "competitions" ALTER COLUMN "isLive" SET DEFAULT 'false'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_tournaments_arena" ADD CONSTRAINT "FK_7e1fd93559084cce752e3860583" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_tournaments_arena" ADD CONSTRAINT "FK_d22c68f28545e9d6da55b2b90c9" FOREIGN KEY ("tournamentsArenaId") REFERENCES "tournaments_arena"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_tournaments_arena" DROP CONSTRAINT "FK_d22c68f28545e9d6da55b2b90c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_tournaments_arena" DROP CONSTRAINT "FK_7e1fd93559084cce752e3860583"`,
    );
    await queryRunner.query(
      `ALTER TABLE "competitions" ALTER COLUMN "isLive" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "tournaments" ALTER COLUMN "isVisible" SET DEFAULT true`,
    );
    await queryRunner.query(`DROP TABLE "users_tournaments_arena"`);
  }
}
