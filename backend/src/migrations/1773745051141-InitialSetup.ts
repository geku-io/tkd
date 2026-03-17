import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSetup1773745051141 implements MigrationInterface {
  name = 'InitialSetup1773745051141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Включаем uuid-ossp extension
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;`,
    );

    // Создаем ENUM тип для ролей пользователей
    await queryRunner.query(`
      CREATE TYPE public.users_role_enum AS ENUM (
        'admin',
        'editor'
      );
    `);

    // Таблица arenas
    await queryRunner.query(`
      CREATE TABLE public.arenas (
        id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
        title text NOT NULL,
        created_at timestamp without time zone DEFAULT now() NOT NULL,
        updated_at timestamp without time zone DEFAULT now() NOT NULL,
        CONSTRAINT "PK_f7751ba5f7bf4ae194a1c1dfe64" PRIMARY KEY (id)
      );
    `);

    // Таблица categories
    await queryRunner.query(`
      CREATE TABLE public.categories (
        id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
        title text NOT NULL,
        created_at timestamp without time zone DEFAULT now() NOT NULL,
        updated_at timestamp without time zone DEFAULT now() NOT NULL,
        CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id)
      );
    `);

    // Таблица disciplines
    await queryRunner.query(`
      CREATE TABLE public.disciplines (
        id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
        title text NOT NULL,
        created_at timestamp without time zone DEFAULT now() NOT NULL,
        updated_at timestamp without time zone DEFAULT now() NOT NULL,
        CONSTRAINT "PK_9b25ea6da0741577a73c9e90aad" PRIMARY KEY (id)
      );
    `);

    // Таблица tournaments
    await queryRunner.query(`
      CREATE TABLE public.tournaments (
        id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
        title text NOT NULL,
        created_at timestamp without time zone DEFAULT now() NOT NULL,
        updated_at timestamp without time zone DEFAULT now() NOT NULL,
        "order" smallint NOT NULL,
        CONSTRAINT "PK_6d5d129da7a80cf99e8ad4833a9" PRIMARY KEY (id)
      );
    `);

    // Таблица competitions
    await queryRunner.query(`
      CREATE TABLE public.competitions (
        id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
        created_at timestamp without time zone DEFAULT now() NOT NULL,
        updated_at timestamp without time zone DEFAULT now() NOT NULL,
        tournament_id uuid,
        discipline_id uuid,
        arena_id uuid,
        "isFinished" boolean DEFAULT false NOT NULL,
        "order" smallint NOT NULL,
        CONSTRAINT "PK_ef273910798c3a542b475e75c7d" PRIMARY KEY (id)
      );
    `);

    // Таблица competition_category (связь many-to-many)
    await queryRunner.query(`
      CREATE TABLE public.competition_category (
        id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
        created_at timestamp without time zone DEFAULT now() NOT NULL,
        updated_at timestamp without time zone DEFAULT now() NOT NULL,
        "competitionId" uuid,
        "categoryId" uuid,
        CONSTRAINT "PK_052c89fe240aeced49d1cbbe27d" PRIMARY KEY (id)
      );
    `);

    // Таблица tournaments_arena (связь many-to-many)
    await queryRunner.query(`
      CREATE TABLE public.tournaments_arena (
        id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
        "order" smallint NOT NULL,
        created_at timestamp without time zone DEFAULT now() NOT NULL,
        updated_at timestamp without time zone DEFAULT now() NOT NULL,
        "tournamentId" uuid,
        "arenaId" uuid,
        CONSTRAINT "PK_4ce68cd40065243fe1127c7399c" PRIMARY KEY (id)
      );
    `);

    // Таблица users
    await queryRunner.query(`
      CREATE TABLE public.users (
        id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
        name text NOT NULL,
        password text NOT NULL,
        created_at timestamp without time zone DEFAULT now() NOT NULL,
        updated_at timestamp without time zone DEFAULT now() NOT NULL,
        role public.users_role_enum DEFAULT 'editor'::public.users_role_enum NOT NULL,
        refresh_token text,
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id)
      );
    `);

    // Foreign keys для competitions
    await queryRunner.query(`
      ALTER TABLE public.competitions 
      ADD CONSTRAINT "FK_3b13ff3af97bdd4141cba2f40ba" 
      FOREIGN KEY (tournament_id) REFERENCES public.tournaments(id) ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE public.competitions 
      ADD CONSTRAINT "FK_2b6e69ccdd33b2d7809d7aa9320" 
      FOREIGN KEY (discipline_id) REFERENCES public.disciplines(id) ON DELETE SET NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE public.competitions 
      ADD CONSTRAINT "FK_82a163c4e3d2c928116a570b320" 
      FOREIGN KEY (arena_id) REFERENCES public.arenas(id) ON DELETE SET NULL;
    `);

    // Foreign keys для competition_category
    await queryRunner.query(`
      ALTER TABLE public.competition_category 
      ADD CONSTRAINT "FK_da086192d817338a459eda20247" 
      FOREIGN KEY ("competitionId") REFERENCES public.competitions(id) ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE public.competition_category 
      ADD CONSTRAINT "FK_c5fde52ff07c96474cf71271c3c" 
      FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON DELETE CASCADE;
    `);

    // Foreign keys для tournaments_arena
    await queryRunner.query(`
      ALTER TABLE public.tournaments_arena 
      ADD CONSTRAINT "FK_df31772aa38c8596884e2083d41" 
      FOREIGN KEY ("tournamentId") REFERENCES public.tournaments(id) ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE public.tournaments_arena 
      ADD CONSTRAINT "FK_1709fecf17f607c07c5feef0cc4" 
      FOREIGN KEY ("arenaId") REFERENCES public.arenas(id) ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаляем foreign keys в обратном порядке
    await queryRunner.query(
      `ALTER TABLE public.tournaments_arena DROP CONSTRAINT IF EXISTS "FK_1709fecf17f607c07c5feef0cc4";`,
    );
    await queryRunner.query(
      `ALTER TABLE public.tournaments_arena DROP CONSTRAINT IF EXISTS "FK_df31772aa38c8596884e2083d41";`,
    );
    await queryRunner.query(
      `ALTER TABLE public.competition_category DROP CONSTRAINT IF EXISTS "FK_c5fde52ff07c96474cf71271c3c";`,
    );
    await queryRunner.query(
      `ALTER TABLE public.competition_category DROP CONSTRAINT IF EXISTS "FK_da086192d817338a459eda20247";`,
    );
    await queryRunner.query(
      `ALTER TABLE public.competitions DROP CONSTRAINT IF EXISTS "FK_82a163c4e3d2c928116a570b320";`,
    );
    await queryRunner.query(
      `ALTER TABLE public.competitions DROP CONSTRAINT IF EXISTS "FK_2b6e69ccdd33b2d7809d7aa9320";`,
    );
    await queryRunner.query(
      `ALTER TABLE public.competitions DROP CONSTRAINT IF EXISTS "FK_3b13ff3af97bdd4141cba2f40ba";`,
    );

    // Удаляем таблицы
    await queryRunner.query(`DROP TABLE public.users;`);
    await queryRunner.query(`DROP TABLE public.tournaments_arena;`);
    await queryRunner.query(`DROP TABLE public.competition_category;`);
    await queryRunner.query(`DROP TABLE public.competitions;`);
    await queryRunner.query(`DROP TABLE public.tournaments;`);
    await queryRunner.query(`DROP TABLE public.disciplines;`);
    await queryRunner.query(`DROP TABLE public.categories;`);
    await queryRunner.query(`DROP TABLE public.arenas;`);

    // Удаляем ENUM тип
    await queryRunner.query(`DROP TYPE public.users_role_enum;`);
  }
}
