import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInfo1776026975584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const disciplines = [
      {
        title: 'Демонстрация технических действий (стоп-балл) 6-7 лет (муж.)',
      },
      {
        title: 'Демонстрация технических действий (стоп-балл) 6-7 лет (жен.)',
      },
      {
        title: 'Демонстрация технических действий (стоп-балл) 8-9 лет (муж.)',
      },
      {
        title: 'Демонстрация технических действий (стоп-балл) 8-9 лет (жен.)',
      },
      { title: 'Поединки (Масоги) 10-11 лет (муж.)' },
      { title: 'Поединки (Масоги) 10-11 лет (жен.)' },
      { title: 'Поединки (Масоги) 12-14 лет (муж.)' },
      { title: 'Поединки (Масоги) 12-14 лет (жен.)' },
      { title: 'Поединки (Масоги) 15-17 лет (муж.)' },
      { title: 'Поединки (Масоги) 15-17 лет (жен.)' },
      { title: 'Поединки (Масоги) (муж.)' },
      { title: 'Поединки (Масоги) (жен.)' },
      { title: 'Поединки (Масоги) Фестиваль (муж.)' },
      { title: 'Поединки (Масоги) Фестиваль (жен.)' },
    ];

    const categories = [
      { title: 'до 18 кг' },
      { title: 'до 20 кг' },
      { title: 'до 23 кг' },
      { title: 'до 26 кг' },
      { title: 'до 29 кг' },
      { title: 'до 32 кг' },
      { title: 'до 35 кг' },
      { title: 'до 39 кг' },
      { title: 'до 43 кг' },
      { title: '43+ кг' },
      { title: 'до 30 кг' },
      { title: 'до 34 кг' },
      { title: 'до 38 кг' },
      { title: 'до 48 кг' },
      { title: 'до 53 кг' },
      { title: '53+ кг' },
    ];

    for (const discipline of disciplines) {
      await queryRunner.query(`INSERT INTO disciplines (title) VALUES ($1)`, [
        discipline.title,
      ]);
    }

    for (const category of categories) {
      await queryRunner.query(`INSERT INTO categories (title) VALUES ($1)`, [
        category.title,
      ]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const disciplines = [
      'Демонстрация технических действий (стоп-балл) 6-7 лет (муж.)',
      'Демонстрация технических действий (стоп-балл) 6-7 лет (жен.)',
      'Демонстрация технических действий (стоп-балл) 8-9 лет (муж.)',
      'Демонстрация технических действий (стоп-балл) 8-9 лет (жен.)',
      'Поединки (Масоги) 10-11 лет (муж.)',
      'Поединки (Масоги) 10-11 лет (жен.)',
      'Поединки (Масоги) 12-14 лет (муж.)',
      'Поединки (Масоги) 12-14 лет (жен.)',
      'Поединки (Масоги) 15-17 лет (муж.)',
      'Поединки (Масоги) 15-17 лет (жен.)',
      'Поединки (Масоги) (муж.)',
      'Поединки (Масоги) (жен.)',
      'Поединки (Масоги) Фестиваль (муж.)',
      'Поединки (Масоги) Фестиваль (жен.)',
    ];

    const categories = [
      'до 18 кг',
      'до 20 кг',
      'до 23 кг',
      'до 26 кг',
      'до 29 кг',
      'до 32 кг',
      'до 35 кг',
      'до 39 кг',
      'до 43 кг',
      '43+ кг',
      'до 30 кг',
      'до 34 кг',
      'до 38 кг',
      'до 48 кг',
      'до 53 кг',
      '53+ кг',
    ];

    for (const title of categories) {
      await queryRunner.query(`DELETE FROM categories WHERE title = $1`, [
        title,
      ]);
    }

    for (const title of disciplines) {
      await queryRunner.query(`DELETE FROM disciplines WHERE title = $1`, [
        title,
      ]);
    }
  }
}
