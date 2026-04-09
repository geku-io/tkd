"use client";

import { createContext, useContext, ReactNode } from "react";
import { IAuthUser } from "../types/main.types";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";
import { fetchApi } from "../lib/fetchApi";
import { API } from "../constants/api";

const UserContext = createContext<IAuthUser | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
   const { data } = useQuery({
      queryKey: [QUERY_KEYS.AUTH],
      queryFn: async () => {
         const result = await fetchApi<IAuthUser>(API.VALIDATE);
         return result;
      },
   });

   return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

export const useGetUserContext = () => {
   const user = useContext(UserContext);
   return user;
};
