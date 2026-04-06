"use client";

import React from "react";
import {
   IStructuredTournament,
   IStructuredTournaments,
} from "../changeTournamentData";
import styles from "../Tournament.module.css";
import AdminTournamentCard from "./AdminTournamentCard";
import TournamentOptions from "../TournamentOptions";
import { ModalType } from "./tournamentModals.constant";
import { IModalIds } from "./AdminTournamentGrid";
import { useGetModalsContext } from "../../../../contexts/ModalsContext";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { fetchApi } from "../../../../lib/fetchApi";
import { API } from "../../../../constants/api";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { toast } from "sonner";

interface IProps {
   data: IStructuredTournaments;
}

const AdminTournamentGridContent = ({ data }: IProps) => {
   const {
      setCurrentId,
      setCurrentType,
      showDeleteModal,
      showUpdateModal,
      showCreateModal,
   } = useGetModalsContext<IModalIds | null, ModalType | null>();

   const updateVisibility = useMutation<
      unknown,
      unknown,
      IStructuredTournament,
      { prevState: IStructuredTournaments | undefined }
   >({
      mutationFn: async (body: IStructuredTournament) => {
         const res = await fetchApi(`${API.TOURNAMENTS}/${body.id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
         });

         return res;
      },

      onMutate: async (updatedTournament, context) => {
         await context.client.cancelQueries({
            queryKey: [QUERY_KEYS.TOURNAMENTS],
         });

         const prevState = context.client.getQueryData<IStructuredTournaments>([
            QUERY_KEYS.TOURNAMENTS,
         ]);

         context.client.setQueryData<IStructuredTournaments>(
            [QUERY_KEYS.TOURNAMENTS],
            old => {
               if (!old) return;
               return {
                  ...old,
                  tournaments: {
                     ...old.tournaments,
                     byId: {
                        ...old.tournaments.byId,
                        [updatedTournament.id]: {
                           ...old.tournaments.byId[updatedTournament.id],
                           isVisible: updatedTournament.isVisible,
                        },
                     },
                  },
               };
            },
         );
         return { prevState };
      },

      onError: (error, variables, onMutateResult, context) => {
         toast.error("Ошибка при изменении видимости");
         context.client.setQueryData(
            [QUERY_KEYS.TOURNAMENTS],
            onMutateResult?.prevState,
         );
      },

      onSettled: (data, error, variables, onMutateResult, context) => {
         context.client.invalidateQueries({
            queryKey: [QUERY_KEYS.TOURNAMENTS],
         });
      },
   });

   return (
      <div>
         {data.tournaments.allIds.map(tournamentId => {
            const currentTournament = data.tournaments.byId[tournamentId];
            const arenas = data.orderByArena[tournamentId];
            const arenaIds = Object.keys(arenas);
            const showTournamentDeleteModal = () => {
               if (showDeleteModal && setCurrentId && setCurrentType) {
                  setCurrentId({ tournamentId });
                  setCurrentType("tournament");
                  showDeleteModal();
               }
            };
            const showTournamentUpdateModal = () => {
               if (showUpdateModal && setCurrentId && setCurrentType) {
                  setCurrentId({ tournamentId });
                  setCurrentType("tournament");
                  showUpdateModal();
               }
            };
            const showArenaCreateModal = () => {
               if (showCreateModal && setCurrentId && setCurrentType) {
                  setCurrentId({ tournamentId });
                  setCurrentType("arena");
                  showCreateModal();
               }
            };
            return (
               <div className="mb-12" key={tournamentId}>
                  <div className="flex gap-x-2 items-center mb-4">
                     <h2 className="inline-block max-sm:grow">
                        {currentTournament.title}
                     </h2>
                     <div className="flex items-center gap-x-1">
                        <button
                           type="button"
                           className="size-5"
                           onClick={() =>
                              updateVisibility.mutate({
                                 ...currentTournament,
                                 isVisible: !currentTournament.isVisible,
                              })
                           }
                        >
                           {currentTournament.isVisible ? (
                              <Eye className="size-full" />
                           ) : (
                              <EyeOff className="size-full" />
                           )}
                        </button>
                        <TournamentOptions
                           showDelete={showTournamentDeleteModal}
                           showUpdate={showTournamentUpdateModal}
                           showCreate={showArenaCreateModal}
                        />
                     </div>
                  </div>
                  <div>
                     {arenaIds.length !== 0 ? (
                        <div className={styles["admin-card-grid"]}>
                           {arenaIds.map(arenaId => {
                              const competitionIdsByArena =
                                 data.orderByArena[tournamentId][arenaId];
                              const competitionsByArena =
                                 competitionIdsByArena.map(
                                    comp => data.competitions.byId[comp],
                                 );
                              return (
                                 <AdminTournamentCard
                                    key={arenaId}
                                    tournamentId={tournamentId}
                                    competitions={competitionsByArena}
                                    competitionsList={competitionIdsByArena}
                                    arenaId={arenaId}
                                    arenaEntity={
                                       data.arenas.byId[arenaId].arena
                                    }
                                 />
                              );
                           })}
                        </div>
                     ) : (
                        <div>Нет арен</div>
                     )}
                  </div>
               </div>
            );
         })}
      </div>
   );
};

export default AdminTournamentGridContent;
