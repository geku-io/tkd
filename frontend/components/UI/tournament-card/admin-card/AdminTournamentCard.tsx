"use client";

import React, { useId } from "react";
import { useDroppable } from "@dnd-kit/core";
import CardOptions from "../CardOptions";
import ActionButton from "../../buttons/ActionButton";
import {
   SortableContext,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AdminCardItem from "./AdminCardItem";
import { ModalType } from "./tournamentModals.constant";
import { IModalIds } from "./AdminTournamentGrid";
import { ICompetition } from "../../../../types/entities.types";
import { IBaseEntityWithTitle } from "../../../../types/main.types";
import { useGetModalsContext } from "../../../../contexts/ModalsContext";

interface IProps {
   competitions: ICompetition[];
   competitionsList: string[];
   tournamentId: string;
   arenaId: string;
   arenaEntity: IBaseEntityWithTitle;
}

const AdminTournamentCard = ({
   competitions,
   tournamentId,
   competitionsList,
   arenaId,
   arenaEntity,
}: IProps) => {
   const droppableId = useId();

   const { setNodeRef } = useDroppable({
      id: droppableId,
      data: { arenaId, tournamentId },
   });
   const {
      setCurrentId,
      setCurrentType,
      showDeleteModal,
      showUpdateModal,
      showCreateModal,
   } = useGetModalsContext<IModalIds | null, ModalType | null>();

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
      <div
         ref={setNodeRef}
         className="bg-light-gray rounded-xl min-h-[300px] shadow-border transition border border-transparent"
      >
         <div className="size-full">
            <div className="flex flex-col h-full text-black py-4 px-2">
               <div className="flex items-center justify-between mb-4">
                  <div className="font-medium pl-2">{arenaEntity.title}</div>
                  <CardOptions
                     showDelete={showDeleteModalHandler}
                     showUpdate={showUpdateModalHandler}
                  />
               </div>
               <div className="grow flex flex-col">
                  <div className="grow">
                     {competitionsList.length > 0 && (
                        <SortableContext
                           items={competitionsList}
                           strategy={verticalListSortingStrategy}
                        >
                           <div className="flex flex-col gap-y-2 mb-6">
                              {competitions.map(competition => (
                                 <AdminCardItem
                                    key={competition.id}
                                    item={competition}
                                    arenaId={arenaId}
                                    tournamentId={tournamentId}
                                 />
                              ))}
                           </div>
                        </SortableContext>
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
      </div>
   );
};

export default AdminTournamentCard;
