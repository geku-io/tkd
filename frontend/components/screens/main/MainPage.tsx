"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { fetchApi } from "../../../lib/fetchApi";
import { IBaseEntityWithTitleAndCount } from "../../../types/main.types";
import { ITournament } from "../../../types/entities.types";
import { API } from "../../../constants/api";
import TournamentGrid from "../../UI/tournament-card/TournamentGrid";
import MainSpinner from "../../UI/MainSpinner";
import Image from "next/image";

interface IProps {
   isInteractive?: boolean;
   isPending?: boolean;
   selectedItems?: string[];
}

const MainPage = ({
   isInteractive = false,
   isPending = false,
   selectedItems,
}: IProps) => {
   const {
      data,
      isPending: fetchIsPending,
      isError,
   } = useQuery({
      queryKey: [QUERY_KEYS.BASE_TOURNAMENTS],
      queryFn: async () => {
         const result = await fetchApi<
            IBaseEntityWithTitleAndCount<ITournament>
         >(API.TOURNAMENTS_PUBLIC);
         const sortedResult = result.data
            .filter(tournament => tournament.isVisible)
            .sort((a, b) => a.order - b.order);
         return { ...result, data: sortedResult };
      },
   });
   if (fetchIsPending || isPending) {
      return <MainSpinner />;
   }
   if (isError) {
      return (
         <div className="size-full">
            <div className="size-full flex flex-col items-center justify-center">
               <Image
                  src="/not-found.png"
                  height={130}
                  width={130}
                  alt="Not found while searching"
                  className="mb-6"
               />
               <h1 className="font-medium mb-2">Соревнования не найдены</h1>
               <div className="text-lg">Предстоящих соревнований пока нет</div>
            </div>
         </div>
      );
   }
   return (
      <TournamentGrid
         tournaments={data.data}
         selectedItems={selectedItems}
         isInteractive={isInteractive}
      />
   );
};

export default MainPage;
