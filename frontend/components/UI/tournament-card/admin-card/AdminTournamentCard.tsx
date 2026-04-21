"use client";

import React, { memo, useMemo } from "react";
import CardOptions from "../CardOptions";
import ActionButton from "../../buttons/ActionButton";
import AdminCardItem from "./AdminCardItem";
import { IBaseEntityWithTitle } from "../../../../types/main.types";
import { useGetModalsActionContext } from "../../../../contexts/ModalsActionContext";
import { IModalIds } from "./AdminTournamentGrid";
import { ModalType } from "./tournamentModals.constant";
import { IStructuredTournaments } from "../changeTournamentData";
import { Droppable } from "@hello-pangea/dnd";
import { cn } from "../../../../lib/utils";

interface IProps {
   tournamentId: string;
   arenaId: string;
   arenaEntity: IBaseEntityWithTitle;
   data: IStructuredTournaments;
}

const AdminTournamentCard = memo(function AdminTournamentCard({
   data,
   tournamentId,
   arenaId,
   arenaEntity,
}: IProps) {
   const {
      setCurrentId,
      setCurrentType,
      showDeleteModal,
      showUpdateModal,
      showCreateModal,
   } = useGetModalsActionContext<IModalIds | null, ModalType | null>();

   const competitionsList = useMemo(() => {
      return data.orderByArena[tournamentId][arenaId];
   }, [arenaId, tournamentId, data]);

   const showCreateModalHandler = () => {
      if (showCreateModal && setCurrentId && setCurrentType) {
         showCreateModal();
         setCurrentType("competition");
         setCurrentId({
            arenaId: arenaId,
            tournamentId: tournamentId,
         });
      }
   };

   const showDeleteModalHandler = () => {
      if (showDeleteModal && setCurrentId && setCurrentType) {
         showDeleteModal();
         setCurrentType("arena");
         setCurrentId({
            arenaId: arenaId,
            tournamentId: tournamentId,
         });
      }
   };
   const showUpdateModalHandler = () => {
      if (showUpdateModal && setCurrentId && setCurrentType) {
         showUpdateModal();
         setCurrentType("arena");
         setCurrentId({
            arenaId: arenaId,
            tournamentId: tournamentId,
         });
      }
   };
   return (
      <Droppable droppableId={`${tournamentId},${arenaId}`}>
         {(provided, snapshot) => (
            <div
               className={cn(
                  "bg-light-gray rounded-xl min-h-[300px] shadow-border transition border border-transparent",
                  { "bg-blue-400": snapshot.isDraggingOver },
               )}
               ref={provided.innerRef}
               {...provided.droppableProps}
            >
               <div className="size-full">
                  <div className="flex flex-col h-full text-black py-4 px-2">
                     <div className="flex items-center justify-between mb-4">
                        <div className="font-medium pl-2">
                           {arenaEntity.title}
                        </div>
                        <CardOptions
                           showDelete={showDeleteModalHandler}
                           showUpdate={showUpdateModalHandler}
                        />
                     </div>
                     <div className="grow flex flex-col">
                        <div className="grow">
                           {competitionsList.length > 0 && (
                              <div className="flex flex-col gap-y-2 mb-6">
                                 {competitionsList.map((id, index) => {
                                    return (
                                       <AdminCardItem
                                          key={id}
                                          id={id}
                                          index={index}
                                          arenaId={arenaId}
                                          tournamentId={tournamentId}
                                          competition={
                                             data.competitions.byId[id]
                                          }
                                       />
                                    );
                                 })}
                              </div>
                           )}
                        </div>
                        <div className="w-full">
                           <ActionButton
                              action={showCreateModalHandler}
                              className="w-full rounded-xl"
                           />
                        </div>
                     </div>
                  </div>
               </div>
               {provided.placeholder}
            </div>
         )}
      </Droppable>
   );
});

export default AdminTournamentCard;
