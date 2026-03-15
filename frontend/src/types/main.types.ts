import { UserRole } from "./entities.types";

export type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ISourceAndKey {
   source: string;
   queryKey: string[] | string;
}

export interface IBaseEntity {
   id: string;
   createdAt: Date;
   updatedAt: Date;
}

export interface IBaseEntityWithTitle extends IBaseEntity {
   title: string;
}

export interface IOrderedBaseEntity extends IBaseEntity {
   order: number;
}

export interface IOrderedBaseEntityWithTitle extends IBaseEntityWithTitle {
   order: number;
}

export interface IBaseEntityWithTitleAndCount<
   T extends IBaseEntity = IBaseEntityWithTitle
> {
   data: T[];
   count: number;
}

export interface IAuthUser {
   id: string;
   name: string;
   role: UserRole;
}

export interface ISession {
   session: IAuthUser;
}

export enum CookieNames {
   AUTH = "Authentication",
   REFRESH = "Refresh",
}
