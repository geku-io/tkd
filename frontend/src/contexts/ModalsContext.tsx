import { SetStateType } from "@/types/main.types";
import React, { createContext, useContext } from "react";

export interface IModalsContext<T = string, Type = string> {
   showDeleteModal?: () => void;
   showUpdateModal?: () => void;
   showCreateModal?: () => void;
   setCurrentId?: SetStateType<T>;
   currentId?: T;
   setCurrentType?: SetStateType<Type>;
   currentType?: Type;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ModalsContext = createContext<IModalsContext<any, any>>({});

interface IModalsProviderProps<T, Type> {
   children: React.ReactNode;
   value: IModalsContext<T, Type>;
}

export function ModalsProvider<T = unknown, Type = unknown>({
   children,
   value,
}: IModalsProviderProps<T, Type>) {
   return (
      <ModalsContext.Provider value={value}>{children}</ModalsContext.Provider>
   );
}

export function useGetModalsContext<T = unknown, Type = unknown>() {
   const modalsContext = useContext<IModalsContext<T, Type>>(ModalsContext);
   return modalsContext;
}
