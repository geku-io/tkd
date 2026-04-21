import React, { createContext, useContext } from "react";
import { SetStateType } from "../types/main.types";

export interface IModalsActCtx<T = string, Type = string> {
   showDeleteModal?: () => void;
   showUpdateModal?: () => void;
   showCreateModal?: () => void;
   setCurrentId?: SetStateType<T>;
   setCurrentType?: SetStateType<Type>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ModalsActionContext = createContext<IModalsActCtx<any, any>>({});

interface IModalsActionProviderProps<T, Type> {
   children: React.ReactNode;
   value: IModalsActCtx<T, Type>;
}

export function ModalsActionProvider<T = unknown, Type = unknown>({
   children,
   value,
}: IModalsActionProviderProps<T, Type>) {
   return (
      <ModalsActionContext.Provider value={value}>
         {children}
      </ModalsActionContext.Provider>
   );
}

export function useGetModalsActionContext<T = unknown, Type = unknown>() {
   const modalsActionContext =
      useContext<IModalsActCtx<T, Type>>(ModalsActionContext);
   return modalsActionContext;
}
