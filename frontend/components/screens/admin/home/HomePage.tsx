"use client";
import React from "react";
import MainBlock from "../MainBlock";
import { useQuery } from "@tanstack/react-query";
import {
   IBaseEntityWithTitleAndCount,
   ISession,
} from "../../../../types/main.types";
import {
   changeTournamentData,
   IStructuredTournaments,
} from "../../../UI/tournament-card/changeTournamentData";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { fetchApi } from "../../../../lib/fetchApi";
import { ITournament } from "../../../../types/entities.types";
import { API } from "../../../../constants/api";
import { Spinner } from "../../../UI/lib-components/spinner";
import { checkAuth } from "../../../../utils/checkAuth";
import { ROUTES, ROUTES_ROLES } from "../../../../constants/routes";
import AddingButton from "../../../UI/buttons/AddingButton";
import AdminTournamentGrid from "../../../UI/tournament-card/admin-card/AdminTournamentGrid";
import NotExist from "../../../UI/NotExist";

const HomePage = ({ session }: ISession) => {
   const { data, isPending, isError } = useQuery<IStructuredTournaments>({
      queryKey: [QUERY_KEYS.TOURNAMENTS],
      queryFn: async () => {
         const result = await fetchApi<
            IBaseEntityWithTitleAndCount<ITournament>
         >(API.TOURNAMENTS);
         return changeTournamentData(result);
      },
   });

   if (isPending) {
      return (
         <div className="size-full flex items-center justify-center">
            <Spinner className="size-16 text-blue-accent" />
         </div>
      );
   }
   if (isError) {
      return <div>Ошибка получения данных</div>;
   }
   return (
      <MainBlock
         title="Список соревнований"
         subTitle="Наглядное представление всех соревнований и мест их проведения"
         actions={
            checkAuth(session.role, ROUTES_ROLES.NEW_COMPETITION) && (
               <AddingButton link={ROUTES.NEW_COMPETITION} />
            )
         }
      >
         {data && data.count !== 0 ? (
            <div>
               <AdminTournamentGrid tournaments={data} />
            </div>
         ) : (
            <NotExist />
         )}
      </MainBlock>
   );
};

export default HomePage;
