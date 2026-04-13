import { IAuthUser } from "./main.types";

declare module "@tanstack/table-core" {
   interface TableMeta {
      user?: IAuthUser;
   }
}
