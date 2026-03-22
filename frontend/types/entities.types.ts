import {
   IBaseEntity,
   IBaseEntityWithTitle,
   IOrderedBaseEntity,
   IOrderedBaseEntityWithTitle,
} from "./main.types";

export interface ICompetitionCategory extends IBaseEntity {
   category: IBaseEntityWithTitle;
}

export interface ICompetition extends IBaseEntity {
   discipline: IBaseEntityWithTitle;
   arena: IBaseEntityWithTitle;
   categories: ICompetitionCategory[];
   order: number;
   isFinished: boolean;
}

export interface ITournamentArena extends IOrderedBaseEntity {
   arena: IBaseEntityWithTitle;
}

export interface ITournament extends IOrderedBaseEntityWithTitle {
   arenas: ITournamentArena[];
   competitions: ICompetition[];
}

export enum UserRole {
   ADMIN = "admin",
   EDITOR = "editor",
}

export const UserRoleTitle: Record<UserRole, string> = {
   admin: "Админ",
   editor: "Арбитр",
};

export interface IUserCredentials {
   name: string;
   role: UserRole;
   password: string;
}

export interface IUser extends IBaseEntity, IUserCredentials {}
