"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
   closestCenter,
   DndContext,
   DragEndEvent,
   DragOverEvent,
   DragOverlay,
   DragStartEvent,
   PointerSensor,
   useSensor,
   useSensors,
} from "@dnd-kit/core";
import CardOverlay from "./CardOverlay";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { IStructuredTournaments } from "../changeTournamentData";
import AdminTournamentGridContent from "./AdminTournamentGridContent";
import { useModalsService } from "./modals.service";
import { modalOptions, ModalType } from "./tournamentModals.constant";
import {
   IArenaInfo,
   IReorderCompetitionBody,
} from "../../../../types/query.types";
import { IBaseEntityWithTitleAndCount } from "../../../../types/main.types";
import { ITournament } from "../../../../types/entities.types";
import { API } from "../../../../constants/api";
import { fetchApi } from "../../../../lib/fetchApi";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { SortableItemDataType } from "../../../../types/dnd.types";
import { ModalsProvider } from "../../../../contexts/ModalsContext";
import { useGetSocketContext } from "../../../../providers/SocketProvider";

const UpdateArenaModal = dynamic(
   () => import("../../modals/arena-modals/UpdateArenaModal"),
   { ssr: false },
);
const CreateCompetitionModal = dynamic(
   () => import("../../modals/competition-modals/CreateCompetitionModal"),
   { ssr: false },
);
const CreateModal = dynamic(() => import("../../modals/CreateModal"), {
   ssr: false,
});
const UpdateCompetitionModal = dynamic(
   () => import("../../modals/competition-modals/UpdateCompetitionModal"),
   { ssr: false },
);
const ConfirmModal = dynamic(() => import("../../modals/ConfirmModal"), {
   ssr: false,
});
const UpdateModal = dynamic(() => import("../../modals/UpdateModal"), {
   ssr: false,
});

interface IProps {
   tournaments: IStructuredTournaments;
}

export interface IModalIds extends Partial<IArenaInfo> {
   competitionId?: string;
}

const AdminTournamentGrid = ({ tournaments }: IProps) => {
   const { socketRef } = useGetSocketContext();
   const queryClient = useQueryClient();
   const [prevTournaments, setPrevTournaments] =
      useState<IStructuredTournaments | null>(null);
   const [currentId, setCurrentId] = useState<IModalIds | null>(null);
   const [currentType, setCurrentType] = useState<ModalType | null>(null);

   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

   const {
      deleteTournamentHandler,
      deleteArenaHandler,
      deleteCompetitionHandler,
   } = useModalsService(currentId);

   const searchId =
      currentType === "competition"
         ? currentId?.competitionId
         : currentType === "arena"
           ? currentId?.arenaId
           : currentId?.tournamentId;

   const getDeleteAction = () => {
      if (currentType === "competition") {
         return deleteCompetitionHandler;
      } else if (currentType === "arena") {
         return deleteArenaHandler;
      } else {
         return deleteTournamentHandler;
      }
   };

   const [activeDragId, setActiveDragId] = useState<string | null>(null);
   const sensors = useSensors(useSensor(PointerSensor));

   const changeOrderMutation = useMutation<
      IBaseEntityWithTitleAndCount<ITournament>,
      unknown,
      IReorderCompetitionBody[]
   >({
      mutationFn: async (competitions: IReorderCompetitionBody[]) => {
         const res = await fetchApi<IBaseEntityWithTitleAndCount<ITournament>>(
            `${API.REORDER_COMPETITIONS}`,
            {
               method: "PATCH",
               body: JSON.stringify({ items: competitions }),
            },
         );

         return res;
      },

      onError: (err, newCompetitions, onMutateResult, context) => {
         toast.error("Ошибка при изменении");
         if (onMutateResult) {
            context.client.setQueryData(
               [QUERY_KEYS.TOURNAMENTS],
               prevTournaments,
            );
         }
      },

      onSettled: (data, error, variables, onMutateResult, context) => {
         context.client.invalidateQueries({
            queryKey: [QUERY_KEYS.TOURNAMENTS],
         });
         setPrevTournaments(null);
      },
   });

   const getOverlayItem = () => {
      if (activeDragId) {
         return tournaments.competitions.byId[activeDragId];
      }
      return null;
   };

   const overlayItem = activeDragId ? getOverlayItem() : null;

   const dragStartHandler = async (event: DragStartEvent) => {
      setActiveDragId(event.active.id.toString());
      await queryClient.cancelQueries({
         queryKey: [QUERY_KEYS.TOURNAMENTS],
      });
      if (!prevTournaments) {
         const prevState = queryClient.getQueryData<IStructuredTournaments>([
            QUERY_KEYS.TOURNAMENTS,
         ]);
         if (prevState) {
            setPrevTournaments(prevState);
         }
      }
   };

   const dragEndHandler = (event: DragEndEvent) => {
      setActiveDragId(null);

      const { active } = event;
      const activeId = active.id as string;

      const activeCompetition = active.data.current as SortableItemDataType;

      const nextTournaments = queryClient.getQueryData<IStructuredTournaments>([
         QUERY_KEYS.TOURNAMENTS,
      ]);

      if (!prevTournaments || !nextTournaments) return;

      const fromTournamentId =
         prevTournaments.competitions.byId[activeId].tournamentId;
      const fromArenaId = prevTournaments.competitions.byId[activeId].arena.id;
      const fromList =
         prevTournaments.orderByArena[fromTournamentId][fromArenaId];

      const toTournamentId = activeCompetition.tournamentId;
      const toArenaId = activeCompetition.arenaId;
      const toList = nextTournaments.orderByArena[toTournamentId][toArenaId];

      const fromIndex = fromList.indexOf(activeId);
      const toIndex = toList.indexOf(activeId);

      if (
         fromTournamentId === toTournamentId &&
         fromArenaId === toArenaId &&
         fromIndex === toIndex
      ) {
         return;
      }

      const nextBody: IReorderCompetitionBody[] = toList.map((item, index) => ({
         id: item,
         tournamentId: toTournamentId,
         arenaId: toArenaId,
         order: index + 1,
      }));

      if (fromTournamentId === toTournamentId && fromArenaId === toArenaId) {
         const minIndex = Math.min(fromIndex, toIndex);
         const maxIndex = Math.max(fromIndex, toIndex);

         const filteredNextBody = nextBody.filter(
            (_, index) => index >= minIndex && index <= maxIndex,
         );

         changeOrderMutation.mutate(filteredNextBody);
      } else {
         const newFromList = fromList.filter(item => item !== activeId);

         const prevBody: IReorderCompetitionBody[] = newFromList.map(
            (item, index) => ({
               id: item,
               tournamentId: fromTournamentId,
               arenaId: fromArenaId,
               order: index + 1,
            }),
         );

         const filteredPrevBody = prevBody.filter(
            (_, index) => index >= fromIndex,
         );

         const filteredNextBody = nextBody.filter(
            (_, index) => index >= toIndex,
         );

         changeOrderMutation.mutate([...filteredPrevBody, ...filteredNextBody]);
      }
   };

   const dragOverHandler = (event: DragOverEvent) => {
      const { active, over } = event;

      if (!prevTournaments || !over?.data.current || active.id === over.id)
         return;
      const overCompetition = over.data.current as SortableItemDataType;

      queryClient.setQueryData<IStructuredTournaments>(
         [QUERY_KEYS.TOURNAMENTS],
         old => {
            if (!old) return old;

            const activeId = active.id as string;
            const overId = over.id as string;

            const fromTournamentId =
               old.competitions.byId[activeId].tournamentId;
            const fromArenaId = old.competitions.byId[activeId].arena.id;
            const fromList = old.orderByArena[fromTournamentId][fromArenaId];

            const toTournamentId = overCompetition.tournamentId;
            const toArenaId = overCompetition.arenaId;
            const toList = old.orderByArena[toTournamentId][toArenaId];

            const fromIndex = fromList.indexOf(activeId);
            const toIndex = toList.indexOf(overId);

            if (
               fromTournamentId === toTournamentId &&
               fromArenaId === toArenaId
            ) {
               const newList = arrayMove(fromList, fromIndex, toIndex);
               return {
                  ...old,
                  orderByArena: {
                     ...old.orderByArena,
                     [fromTournamentId]: {
                        ...old.orderByArena[fromTournamentId],
                        [fromArenaId]: newList,
                     },
                  },
               };
            } else {
               const arenaEntity = old.arenas.byId[toArenaId];

               const newFromList = fromList.filter(item => item !== activeId);
               let newToList: string[] = [];

               if (toList.length === 0) {
                  newToList.push(activeId);
               } else {
                  if (toIndex === -1) {
                     newToList = [...toList, activeId];
                  } else {
                     newToList = [
                        ...toList.slice(0, toIndex),
                        activeId,
                        ...toList.slice(toIndex),
                     ];
                  }
               }

               let nextOrderByArena: Record<
                  string,
                  Record<string, string[]>
               > = {};

               if (fromTournamentId === toTournamentId) {
                  nextOrderByArena = {
                     ...old.orderByArena,
                     [fromTournamentId]: {
                        ...old.orderByArena[fromTournamentId],
                        [fromArenaId]: newFromList,
                        [toArenaId]: newToList,
                     },
                  };
               } else {
                  nextOrderByArena = {
                     ...old.orderByArena,
                     [fromTournamentId]: {
                        ...old.orderByArena[fromTournamentId],
                        [fromArenaId]: newFromList,
                     },
                     [toTournamentId]: {
                        ...old.orderByArena[toTournamentId],
                        [toArenaId]: newToList,
                     },
                  };
               }
               return {
                  ...old,
                  competitions: {
                     ...old.competitions,
                     byId: {
                        ...old.competitions.byId,
                        [activeId]: {
                           ...old.competitions.byId[activeId],
                           arena: arenaEntity.arena,
                           tournamentId: toTournamentId,
                        },
                     },
                  },
                  orderByArena: nextOrderByArena,
               };
            }
         },
      );
   };

   const modalsProps = currentType && modalOptions[currentType];

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
      <DndContext
         collisionDetection={closestCenter}
         sensors={sensors}
         onDragStart={dragStartHandler}
         onDragEnd={dragEndHandler}
         onDragOver={dragOverHandler}
      >
         <ModalsProvider<IModalIds | null, ModalType | null>
            value={{
               currentId,
               setCurrentId,
               currentType,
               setCurrentType,
               showDeleteModal: () => setIsDeleteModalOpen(true),
               showUpdateModal: () => setIsUpdateModalOpen(true),
               showCreateModal: () => setIsCreateModalOpen(true),
            }}
         >
            {isDeleteModalOpen && (
               <ConfirmModal
                  title={modalsProps?.title || modalsProps?.delete?.title}
                  description={
                     modalsProps?.description ||
                     modalsProps?.delete?.description
                  }
                  actionBtnText="Удалить"
                  confirmedAction={getDeleteAction()}
                  isOpen={isDeleteModalOpen}
                  setIsOpen={setIsDeleteModalOpen}
                  btnType="delete"
               />
            )}
            {isUpdateModalOpen &&
               currentType !== "competition" &&
               currentType !== "arena" && (
                  <UpdateModal
                     id={searchId ?? null}
                     isOpen={isUpdateModalOpen}
                     setIsOpen={setIsUpdateModalOpen}
                     source={modalsProps?.update?.source ?? modalsProps?.source}
                     searchSource={
                        modalsProps?.update?.searchSource ??
                        modalsProps?.searchSource
                     }
                     queryKey={
                        modalsProps?.update?.queryKey ?? modalsProps?.queryKey
                     }
                  />
               )}
            {isCreateModalOpen && currentType !== "competition" && (
               <CreateModal
                  isOpen={isCreateModalOpen}
                  setIsOpen={setIsCreateModalOpen}
                  tournamentId={currentId?.tournamentId}
                  isAdding={true}
                  title={modalsProps?.title || modalsProps?.create?.title}
                  description={
                     modalsProps?.description ||
                     modalsProps?.create?.description
                  }
                  source={modalsProps?.create?.source ?? modalsProps?.source}
                  searchSource={
                     modalsProps?.create?.searchSource ??
                     modalsProps?.searchSource
                  }
                  queryKey={
                     modalsProps?.create?.queryKey ?? modalsProps?.queryKey
                  }
               />
            )}

            {currentType === "competition" && (
               <CreateCompetitionModal
                  isOpen={isCreateModalOpen}
                  setIsOpen={setIsCreateModalOpen}
                  tournamentId={currentId?.tournamentId}
                  arenaId={currentId?.arenaId}
                  queryKey={
                     modalsProps?.create?.queryKey ?? modalsProps?.queryKey
                  }
                  title="Добавление соревнованией"
                  description="Добавьте одну или несколько записей дисциплин"
               />
            )}
            {currentType === "competition" && (
               <UpdateCompetitionModal
                  id={searchId ?? null}
                  isOpen={isUpdateModalOpen}
                  setIsOpen={setIsUpdateModalOpen}
                  source={modalsProps?.update?.source ?? modalsProps?.source}
                  queryKey={
                     modalsProps?.update?.queryKey ?? modalsProps?.queryKey
                  }
                  title="Изменение соревнования"
                  description="Измените название дисциплины или категорий у соревнования"
               />
            )}
            {currentType === "arena" && (
               <UpdateArenaModal
                  isOpen={isUpdateModalOpen}
                  setIsOpen={setIsUpdateModalOpen}
                  source={modalsProps?.update?.source ?? modalsProps?.source}
                  searchSource={
                     modalsProps?.update?.searchSource ??
                     modalsProps?.searchSource
                  }
                  queryKey={
                     modalsProps?.update?.queryKey ?? modalsProps?.queryKey
                  }
                  title="Изменение названия арены"
                  description="Измените название арены для данного соревнования"
               />
            )}
            <AdminTournamentGridContent data={tournaments} />
         </ModalsProvider>
         {createPortal(
            <DragOverlay>
               {activeDragId && overlayItem ? (
                  <CardOverlay item={overlayItem} />
               ) : null}
            </DragOverlay>,
            document.body,
         )}
      </DndContext>
   );
};

export default AdminTournamentGrid;
