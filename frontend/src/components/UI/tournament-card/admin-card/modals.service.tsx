import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useDeleteEntities, useDeleteEntity } from "@/hooks/query";
import { IArenaInfo } from "@/types/query.types";
import { IModalIds } from "./AdminTournamentGrid";

export const useModalsService = (currentId: IModalIds | null) => {
   const deleteTournament = useDeleteEntity({
      queryKey: QUERY_KEYS.TOURNAMENTS,
      source: API.TOURNAMENTS,
   });

   const deleteCompetition = useDeleteEntity({
      queryKey: QUERY_KEYS.TOURNAMENTS,
      source: API.COMPETITIONS,
   });

   const deleteArena = useDeleteEntities<IArenaInfo>({
      queryKey: QUERY_KEYS.TOURNAMENTS,
      source: API.ARENAS_IN_TOURNAMENT,
   });

   const deleteTournamentHandler = () => {
      if (currentId?.tournamentId) {
         deleteTournament.mutate({ id: currentId.tournamentId });
      }
   };

   const deleteArenaHandler = () => {
      if (
         currentId?.arenaId &&
         currentId.tournamentId &&
         typeof currentId === "object"
      ) {
         deleteArena.mutate({
            items: [
               {
                  arenaId: currentId.arenaId,
                  tournamentId: currentId.tournamentId,
               },
            ],
         });
      }
   };

   const deleteCompetitionHandler = () => {
      if (
         currentId?.arenaId &&
         currentId.tournamentId &&
         currentId.competitionId
      ) {
         deleteCompetition.mutate({
            id: currentId.competitionId,
            body: {
               arenaId: currentId.arenaId,
               tournamentId: currentId.tournamentId,
            },
         });
      }
   };

   return {
      deleteTournamentHandler,
      deleteArenaHandler,
      deleteCompetitionHandler,
   };
};
