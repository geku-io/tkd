"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import {
   IStructuredCompetition,
   IStructuredTournaments,
} from "../changeTournamentData";
import AdminTournamentGridContent from "./AdminTournamentGridContent";
import {
   IArenaInfo,
   IReorderCompetitionBody,
} from "../../../../types/query.types";
import { IBaseEntityWithTitleAndCount } from "../../../../types/main.types";
import { ITournament } from "../../../../types/entities.types";
import { API } from "../../../../constants/api";
import { fetchApi } from "../../../../lib/fetchApi";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { useGetSocketContext } from "../../../../providers/SocketProvider";
import AdminTournamentModals from "./AdminTournamentModals";

interface IProps {
   tournaments: IStructuredTournaments;
}

export interface IModalIds extends Partial<IArenaInfo> {
   competitionId?: string;
}

interface IMutationVariables {
   competitions: IReorderCompetitionBody[];
   newState: IStructuredTournaments;
}

const AdminTournamentGrid = ({ tournaments }: IProps) => {
   const [draftTournaments, setDraftTournaments] = useState(tournaments);
   const { socketRef } = useGetSocketContext();
   const queryClient = useQueryClient();

   function arrayMove(arr: string[], from: number, to: number) {
      const copy = [...arr];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
   }

   const { mutate: changeOrder } = useMutation<
      IBaseEntityWithTitleAndCount<ITournament>,
      unknown,
      IMutationVariables,
      IStructuredTournaments | undefined
   >({
      mutationFn: async ({ competitions }: IMutationVariables) => {
         const res = await fetchApi<IBaseEntityWithTitleAndCount<ITournament>>(
            `${API.REORDER_COMPETITIONS}`,
            {
               method: "PATCH",
               body: JSON.stringify({ items: competitions }),
            },
         );
         return res;
      },

      onMutate: async ({ newState }, context) => {
         await context.client.cancelQueries({
            queryKey: [QUERY_KEYS.TOURNAMENTS],
         });

         const previousTodos =
            context.client.getQueryData<IStructuredTournaments>([
               QUERY_KEYS.TOURNAMENTS,
            ]);

         queryClient.setQueryData([QUERY_KEYS.TOURNAMENTS], newState);

         return previousTodos;
      },

      onError: (err, newCompetitions, onMutateResult, context) => {
         toast.error("Ошибка при изменении");
         if (onMutateResult) {
            context.client.setQueryData(
               [QUERY_KEYS.TOURNAMENTS],
               onMutateResult,
            );
         }
      },

      onSettled: (data, error, variables, onMutateResult, context) => {
         context.client.invalidateQueries({
            queryKey: [QUERY_KEYS.TOURNAMENTS],
         });
      },
   });

   const dragEndHandler = useCallback(
      (event: DropResult) => {
         const { destination, draggableId, source } = event;

         const prevTournaments = tournaments;

         if (destination && prevTournaments) {
            const [initialTourId, initialArenaId] =
               source.droppableId.split(",");
            const [tourId, arenaId] = destination.droppableId.split(",");

            const initialIndex = source.index;
            const index = destination.index;

            if (
               initialTourId === tourId &&
               initialArenaId === arenaId &&
               initialIndex === index
            ) {
               return;
            }

            const sourceList =
               prevTournaments.orderByArena[initialTourId][initialArenaId];

            const getOrderedCompetitions = (listArr: string[][]) => {
               const orderedCompetitions: Record<
                  string,
                  IStructuredCompetition
               > = {
                  ...prevTournaments.competitions.byId,
               };
               for (const newList of listArr) {
                  newList.forEach((competitionId, competitionIndex) => {
                     orderedCompetitions[competitionId] = {
                        ...prevTournaments.competitions.byId[competitionId],
                        order: competitionIndex + 1,
                     };
                  });
               }
               return orderedCompetitions;
            };

            const getBody = (list: string[], tour: string, arena: string) => {
               return list.map((item, index) => ({
                  id: item,
                  tournamentId: tour,
                  arenaId: arena,
                  order: index + 1,
               }));
            };

            if (destination.droppableId === source.droppableId) {
               const newList = arrayMove(sourceList, initialIndex, index);

               const newState = {
                  ...prevTournaments,
                  competitions: {
                     ...prevTournaments.competitions,
                     byId: getOrderedCompetitions([newList]),
                  },
                  orderByArena: {
                     ...prevTournaments.orderByArena,
                     [initialTourId]: {
                        ...prevTournaments.orderByArena[initialTourId],
                        [initialArenaId]: newList,
                     },
                  },
               };

               const nextBody: IReorderCompetitionBody[] = getBody(
                  newList,
                  tourId,
                  arenaId,
               );

               const minIndex = Math.min(initialIndex, index);
               const maxIndex = Math.max(initialIndex, index);

               const filteredNextBody = nextBody.filter(
                  (_, index) => index >= minIndex && index <= maxIndex,
               );

               setDraftTournaments(newState);
               changeOrder({ competitions: filteredNextBody, newState });
            } else {
               const arenaEntity = prevTournaments.arenas.byId[arenaId];

               let newTargetList: string[] = [];
               const targetList = prevTournaments.orderByArena[tourId][arenaId];

               const newSourceList = sourceList.filter(
                  item => item !== draggableId,
               );

               if (targetList.length === 0) {
                  newTargetList.push(draggableId);
               } else {
                  if (index === undefined) {
                     newTargetList = targetList.concat(draggableId);
                  } else {
                     newTargetList = [
                        ...targetList.slice(0, index),
                        draggableId,
                        ...targetList.slice(index),
                     ];
                  }
               }

               const orderedCompetitions = getOrderedCompetitions([
                  newSourceList,
                  newTargetList,
               ]);

               const newState = {
                  ...prevTournaments,
                  competitions: {
                     ...prevTournaments.competitions,
                     byId: {
                        ...orderedCompetitions,
                        [draggableId]: {
                           ...orderedCompetitions[draggableId],
                           arena: arenaEntity.arena,
                           tournamentId: tourId,
                        },
                     },
                  },
                  orderByArena: {
                     ...prevTournaments.orderByArena,
                     [tourId]: {
                        ...prevTournaments.orderByArena[tourId],
                        [arenaId]: newTargetList,
                        [initialArenaId]: newSourceList,
                     },
                  },
               };

               const prevBody = getBody(
                  newSourceList,
                  initialTourId,
                  initialArenaId,
               );
               const nextBody = getBody(newTargetList, tourId, arenaId);

               const filteredPrevBody = prevBody.filter(
                  (_, i) => i >= initialIndex,
               );

               const filteredNextBody = nextBody.filter((_, i) => i >= index);

               setDraftTournaments(newState);

               changeOrder({
                  competitions: [...filteredPrevBody, ...filteredNextBody],
                  newState,
               });
            }
         }
      },
      [changeOrder, tournaments],
   );

   useEffect(() => {
      if (!socketRef || !socketRef.current) return;
      const socket = socketRef.current;

      socket.on("tournament:edited", () => {
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOURNAMENTS] });
      });

      return () => {
         socket.off("tournament:edited");
      };
   }, [socketRef, queryClient]);

   return (
      <DragDropContext onDragEnd={dragEndHandler}>
         <AdminTournamentModals>
            <AdminTournamentGridContent data={draftTournaments} />
         </AdminTournamentModals>
      </DragDropContext>
   );
};

export default AdminTournamentGrid;
