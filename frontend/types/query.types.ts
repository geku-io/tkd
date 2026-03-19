export interface IReorderCompetitionBody {
   id: string;
   order: number;
   tournamentId: string;
   arenaId: string;
}

export interface ICreateCompetitionBody {
   tournamentId?: string;
   tournamentTitle?: string;
   arenas: {
      arenaId?: string;
      arenaTitle?: string;
      info: {
         discipline?: string;
         categories: string[];
      }[];
   }[];
}

export interface IUpdateCompetitionStatusBody {
   id: string;
   isFinished: boolean;
}

export interface IDeleteMany<T> {
   items: T[];
}

export interface IUpdateEntity {
   title: string;
}

export interface IUpdateArena extends IArenaInfo, IUpdateEntity {}

export interface IArenaInfo {
   arenaId: string;
   tournamentId: string;
}

export interface ICompetitionInfo {
   discipline: string;
   categories: string[];
}

export interface IIdWithBody<T> {
   id: string;
   body?: T;
}

export interface ICreateEntities extends Partial<IArenaInfo> {
   titles: string[];
}
