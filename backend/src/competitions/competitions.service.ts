import { Injectable } from '@nestjs/common';
import { CreateCompetitionDto } from './dto/create-competition.dto';
import {
  ReorderCompetitionDto,
  ReorderCompetitionItem,
  UpdateCompetitionDto,
} from './dto/update-competition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Competition } from './entities/competition.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Discipline } from 'src/disciplines/entities/discipline.entity';
import { Tournament } from 'src/tournaments/entities/tournament.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Arena } from 'src/arenas/entities/arenas.entity';
import { CompetitionCategory } from 'src/competition_categories/entities/competition_category.entity';
import {
  RemoveCompetitionItemDto,
  RemoveCompetitionsDto,
} from './dto/remove-competitions.dto';
import { TournamentsArena } from 'src/tournaments_arenas/entities/tournaments_arena.entity';
import { DisciplinesService } from 'src/disciplines/disciplines.service';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class CompetitionsService {
  constructor(
    @InjectRepository(Competition)
    private competitionRepository: Repository<Competition>,

    @InjectRepository(Discipline)
    private disciplineRepository: Repository<Discipline>,

    @InjectRepository(Tournament)
    private tournamentRepository: Repository<Tournament>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(CompetitionCategory)
    private ccRepository: Repository<CompetitionCategory>,

    @InjectRepository(TournamentsArena)
    private taRepository: Repository<TournamentsArena>,

    @InjectRepository(Arena)
    private arenaRepository: Repository<Arena>,

    private disciplinesService: DisciplinesService,

    private categoriesService: CategoriesService,
  ) {}

  async create(createCompetitionDto: CreateCompetitionDto) {
    const allCompetitions: Competition[] = [];
    const { tournamentTitle, tournamentId, arenas } = createCompetitionDto;

    if (!tournamentTitle && !tournamentId) return;

    let tournament: Tournament | null;

    if (tournamentTitle) {
      tournament = await this.tournamentRepository.findOne({
        where: [
          {
            title: tournamentTitle,
          },
        ],
      });
    } else {
      tournament = await this.tournamentRepository.findOne({
        where: [
          {
            id: tournamentTitle,
          },
        ],
      });
    }

    if (!tournament) {
      const tournamentsCount = await this.tournamentRepository.count();
      const tournamentOrder = tournamentsCount + 1;

      tournament = await this.tournamentRepository.save(
        this.tournamentRepository.create({
          title: tournamentTitle,
          order: tournamentOrder,
        }),
      );
    }

    for (const arenaItem of arenas) {
      const { arenaTitle, arenaId, info } = arenaItem;

      if (!arenaTitle && !arenaId) continue;

      let arena: Arena | null;

      if (arenaTitle) {
        arena = await this.arenaRepository.findOne({
          where: [{ title: arenaTitle }],
        });
      } else {
        arena = await this.arenaRepository.findOne({
          where: [
            {
              id: arenaId,
            },
          ],
        });
      }

      if (!arena) {
        arena = await this.arenaRepository.save(
          this.arenaRepository.create({ title: arenaTitle }),
        );
      }

      const isExistTA = await this.taRepository.findOne({
        where: {
          arena: {
            id: arena.id,
          },
          tournament: {
            id: tournament.id,
          },
        },
      });

      if (!isExistTA) {
        const lastTA = await this.taRepository.findOne({
          where: { tournament: { id: tournament.id } },
          order: { order: 'DESC' },
        });

        const arenaOrder = lastTA ? lastTA.order + 1 : 1;

        await this.taRepository.save(
          this.taRepository.create({ arena, tournament, order: arenaOrder }),
        );
      }

      if (info && info.length > 0) {
        for (const infoItem of info) {
          const allCategories: Category[] = [];

          const { discipline: disciplineTitle, categories } = infoItem;

          let discipline: Discipline | null = null;

          if (disciplineTitle) {
            discipline = await this.disciplineRepository.findOne({
              where: {
                title: disciplineTitle,
              },
            });

            if (!discipline) {
              discipline = await this.disciplineRepository.save(
                this.disciplineRepository.create({ title: disciplineTitle }),
              );
            }

            if (categories && categories.length > 0) {
              for (const categoryItem of categories) {
                let category = await this.categoryRepository.findOne({
                  where: {
                    title: categoryItem,
                  },
                });

                if (!category) {
                  category = await this.categoryRepository.save(
                    this.categoryRepository.create({ title: categoryItem }),
                  );
                }
                allCategories.push(category);
              }
            }

            const competitionsByAll = await this.competitionRepository.find({
              where: {
                tournament: {
                  id: tournament.id,
                },
                arena: {
                  id: arena.id,
                },
                discipline: {
                  title: discipline.title,
                },
              },
              relations: {
                categories: {
                  category: true,
                },
              },
            });

            const sortedCategoryTitles = allCategories
              .map((c) => c.title)
              .sort();

            const isCompetitonDuplicate = competitionsByAll.some(
              (competition) => {
                const categorieTitles = competition.categories
                  ?.map((item) => item.category.title)
                  .sort();

                if (
                  !categorieTitles ||
                  categorieTitles.length !== sortedCategoryTitles.length
                ) {
                  return false;
                }

                return sortedCategoryTitles.every(
                  (title, index) => title === categorieTitles[index],
                );
              },
            );

            if (isCompetitonDuplicate) continue;

            const competitionsByArena = await this.competitionRepository.find({
              where: {
                tournament: {
                  id: tournament.id,
                },
                arena: {
                  id: arena.id,
                },
              },
              order: {
                order: 'DESC',
              },
            });

            const competitionOrder =
              competitionsByArena.length > 0
                ? competitionsByArena[0].order + 1
                : 1;

            const competition = await this.competitionRepository.save(
              this.competitionRepository.create({
                tournament,
                arena,
                discipline,
                order: competitionOrder,
              }),
            );

            for (const category of allCategories) {
              const existing = await this.ccRepository.findOne({
                where: { category, competition },
              });
              if (!existing) {
                await this.ccRepository.save(
                  this.ccRepository.create({ category, competition }),
                );
              }
            }
            allCompetitions.push(competition);
          }
        }
      }
    }
    return allCompetitions;
  }

  /* async findAll(query: FindCompetitionsDto) {
    const { q: querySearch, limit, skip } = query;

    const [data, count] = await this.competitionRepository.findAndCount({
      take: limit,
      skip: skip,
      where: querySearch
        ? {
            title: ILike(`%${querySearch}%`),
          }
        : undefined,
    });
    return {
      data,
      count,
    };
  } */

  findOne(id: string) {
    return this.competitionRepository.findOneBy({ id });
  }

  async update(id: string, updateCompetitionDto: UpdateCompetitionDto) {
    const { isFinished, categories, discipline } = updateCompetitionDto;
    if (
      Object.values(updateCompetitionDto).every((item) => item === undefined)
    ) {
      throw new Error('Нет аргументов');
    }

    if (!discipline && !categories) {
      return this.competitionRepository.update(id, {
        isFinished: isFinished,
      });
    }

    const oldCompetition = await this.findOne(id);

    let newDiscipline: Discipline | null = null;

    if (oldCompetition) {
      if (discipline) {
        if (oldCompetition.discipline?.title !== discipline) {
          [newDiscipline] = await this.disciplinesService.create({
            titles: [discipline],
          });
        }
      }

      if (categories) {
        await this.ccRepository.delete({ competition: { id } });

        for (const categoryTitle of categories) {
          let category = await this.categoryRepository.findOne({
            where: { title: categoryTitle },
          });

          if (!category) {
            const [newCategory] = await this.categoriesService.create({
              titles: [categoryTitle],
            });
            category = newCategory;
          }

          await this.ccRepository.save(
            this.ccRepository.create({
              competition: {
                id: oldCompetition.id,
              },
              category,
            }),
          );
        }
      }

      return this.competitionRepository.save({
        ...oldCompetition,
        discipline: newDiscipline ?? oldCompetition.discipline,
        isFinished: isFinished ?? oldCompetition.isFinished,
      });
    }
  }

  async reorder(updateCompetitionDto: ReorderCompetitionDto) {
    const { items } = updateCompetitionDto;
    const entities: UpdateResult[] = [];
    for (const item of items) {
      const mutation = await this.competitionRepository.update(item.id, {
        order: item.order,
        tournament: {
          id: item.tournamentId,
        },
        arena: {
          id: item.arenaId,
        },
      });
      entities.push(mutation);
    }
    return entities;
  }

  async removeAllByArena(body: RemoveCompetitionsDto) {
    const { items } = body;
    const deletedCompetitionArr: DeleteResult[] = [];

    for (const { arenaId, tournamentId } of items) {
      const deletedCompetition = await this.competitionRepository.delete({
        arena: {
          id: arenaId,
        },
        tournament: {
          id: tournamentId,
        },
      });
      deletedCompetitionArr.push(deletedCompetition);
    }
    return deletedCompetitionArr;
  }

  async remove(id: string, arenaInfo: RemoveCompetitionItemDto) {
    const competitions = await this.competitionRepository.find({
      where: {
        tournament: {
          id: arenaInfo.tournamentId,
        },
        arena: {
          id: arenaInfo.arenaId,
        },
      },
      order: {
        order: 'ASC',
      },
    });
    const removingIndex = competitions.findIndex((item) => item.id === id);
    if (competitions && removingIndex !== -1) {
      const updatingComps: ReorderCompetitionItem[] = competitions
        .filter((_, index) => index > removingIndex)
        .map((comp) => ({
          id: comp.id,
          arenaId: arenaInfo.arenaId,
          tournamentId: arenaInfo.tournamentId,
          order: comp.order - 1,
        }));
      const deleteResult = await this.competitionRepository.delete({ id });
      if (deleteResult.affected === 1) {
        await this.reorder({ items: updatingComps });
      }
      return deleteResult;
    }
  }
}
