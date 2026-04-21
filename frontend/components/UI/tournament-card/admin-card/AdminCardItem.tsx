import React, { memo } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Checkbox } from "../../lib-components/checkbox";
import CardOptions from "../CardOptions";
import { IStructuredTournaments } from "../changeTournamentData";
import { IModalIds } from "./AdminTournamentGrid";
import { ModalType } from "./tournamentModals.constant";
import {
   IUpdateCompetitionStatusBody,
   IUpdateLiving,
} from "../../../../types/query.types";
import { fetchApi } from "../../../../lib/fetchApi";
import { API } from "../../../../constants/api";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { cn } from "../../../../lib/utils";
import { GripVertical, Zap } from "lucide-react";
import { useGetModalsActionContext } from "../../../../contexts/ModalsActionContext";
import { ICompetition } from "../../../../types/entities.types";
import { Draggable } from "@hello-pangea/dnd";

interface IProps {
   id: string;
   index: number;
   tournamentId: string;
   arenaId: string;
   competition: ICompetition;
}

const AdminCardItem = memo(function AdminCardItem({
   id,
   index,
   tournamentId,
   arenaId,
   competition,
}: IProps) {
   const { setCurrentId, setCurrentType, showDeleteModal, showUpdateModal } =
      useGetModalsActionContext<IModalIds | null, ModalType | null>();

   const updateLiving = useMutation<
      unknown,
      unknown,
      IUpdateLiving,
      { prevState: IStructuredTournaments | undefined }
   >({
      mutationFn: async (body: IUpdateLiving) => {
         const res = await fetchApi(`${API.COMPETITIONS}/${body.id}`, {
            method: "PATCH",
            body: JSON.stringify({
               isLive: body.isLive,
               isFinished: body?.isFinished,
            }),
         });

         return res;
      },

      onMutate: async (updatedCompetition, context) => {
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
                  competitions: {
                     ...old.competitions,
                     byId: {
                        ...old.competitions.byId,
                        [updatedCompetition.id]: {
                           ...old.competitions.byId[updatedCompetition.id],
                           isLive: updatedCompetition.isLive,
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

   const updateStatusMutation = useMutation<
      unknown,
      unknown,
      IUpdateCompetitionStatusBody,
      { prevState: IStructuredTournaments | undefined }
   >({
      mutationFn: async (body: IUpdateCompetitionStatusBody) => {
         const res = await fetchApi(`${API.COMPETITIONS}/${body.id}`, {
            method: "PATCH",
            body: JSON.stringify({
               isFinished: body.isFinished,
               isLive: body?.isLive,
            }),
         });

         return res;
      },

      onMutate: async (updatedCompetition, context) => {
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
                  competitions: {
                     ...old.competitions,
                     byId: {
                        ...old.competitions.byId,
                        [updatedCompetition.id]: {
                           ...old.competitions.byId[updatedCompetition.id],
                           isFinished: updatedCompetition.isFinished,
                        },
                     },
                  },
               };
            },
         );
         return { prevState };
      },

      onError: (error, variables, onMutateResult, context) => {
         toast.error("Ошибка при изменении статуса");
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

   if (!competition || !competition.discipline) return null;

   const showDeleteModalHandler = () => {
      if (showDeleteModal && setCurrentId && setCurrentType) {
         showDeleteModal();
         setCurrentType("competition");
         setCurrentId({ competitionId: id, tournamentId, arenaId });
      }
   };
   const showUpdateModalHandler = () => {
      if (showUpdateModal && setCurrentId && setCurrentType) {
         showUpdateModal();
         setCurrentType("competition");
         setCurrentId({ competitionId: id, tournamentId, arenaId });
      }
   };

   const handleChecked = () => {
      updateStatusMutation.mutate({
         id: id,
         isFinished: !competition.isFinished,
         isLive:
            !competition.isFinished && competition.isLive ? false : undefined,
      });
   };

   return (
      <Draggable draggableId={id} index={index}>
         {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.draggableProps}>
               <div
                  className={cn(
                     "flex items-center gap-x-3 bg-white rounded-xl shadow-light p-2 text-sm min-h-10",
                     { "opacity-50": snapshot.isDragging },
                  )}
               >
                  <div className="flex items-center justify-center">
                     <Checkbox
                        checked={competition.isFinished}
                        onCheckedChange={handleChecked}
                        className="size-4"
                     />
                  </div>

                  <div className="grow">
                     {competition.discipline.title}
                     {competition.categories.length > 0 && (
                        <span>
                           {", "}

                           {competition.categories
                              .map(item => item.category.title)
                              .join(", ")}
                        </span>
                     )}
                  </div>
                  <div className="flex items-center gap-x-1 shrink-0">
                     <div
                        className="grow cursor-grab touch-none"
                        {...provided.dragHandleProps}
                     >
                        <GripVertical size={18} />
                     </div>
                     <button
                        type="button"
                        onClick={() =>
                           updateLiving.mutate({
                              ...competition,
                              isLive: !competition.isLive,
                              isFinished:
                                 !competition.isLive && competition.isFinished
                                    ? false
                                    : undefined,
                           })
                        }
                        className={cn({
                           "text-red-accent": competition.isLive,
                        })}
                     >
                        <Zap size={16} />
                     </button>
                     <CardOptions
                        showDelete={showDeleteModalHandler}
                        showUpdate={showUpdateModalHandler}
                        isVertical={true}
                     />
                  </div>
               </div>
            </div>
         )}
      </Draggable>
   );
});

export default AdminCardItem;
