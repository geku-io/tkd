import React from "react";
import { cn } from "@/lib/utils";
import { ICompetition } from "@/types/entities.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "@tanstack/react-query";
import { API } from "@/constants/api";
import { toast } from "sonner";
import { IUpdateCompetitionStatusBody } from "@/types/query.types";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { Checkbox } from "../../lib-components/checkbox";
import CardOptions from "../CardOptions";
import { IStructuredTournaments } from "../changeTournamentData";
import { useGetModalsContext } from "@/contexts/ModalsContext";
import { fetchApi } from "@/lib/fetchApi";
import { IModalIds } from "./AdminTournamentGrid";
import { ModalType } from "./tournamentModals.constant";

interface IProps {
   item: ICompetition;
   tournamentId: string;
   arenaId: string;
}

const AdminCardItem = ({ item, tournamentId, arenaId }: IProps) => {
   const { setCurrentId, setCurrentType, showDeleteModal, showUpdateModal } =
      useGetModalsContext<IModalIds | null, ModalType | null>();

   const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      setActivatorNodeRef,
      isDragging,
   } = useSortable({ id: item.id, data: { arenaId, tournamentId } });

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
            }
         );
         return { prevState };
      },

      onError: (error, variables, onMutateResult, context) => {
         toast.error("Ошибка при изменении статуса");
         context.client.setQueryData(
            [QUERY_KEYS.TOURNAMENTS],
            onMutateResult?.prevState
         );
      },

      onSettled: (data, error, variables, onMutateResult, context) => {
         context.client.invalidateQueries({
            queryKey: [QUERY_KEYS.TOURNAMENTS],
         });
      },
   });

   const style = {
      transform: CSS.Transform.toString(transform),
      transition,
   };

   const showDeleteModalHandler = () => {
      if (showDeleteModal && setCurrentId && setCurrentType) {
         showDeleteModal();
         setCurrentType("competition");
         setCurrentId({ competitionId: item.id, tournamentId, arenaId });
      }
   };
   const showUpdateModalHandler = () => {
      if (showUpdateModal && setCurrentId && setCurrentType) {
         showUpdateModal();
         setCurrentType("competition");
         setCurrentId({ competitionId: item.id, tournamentId, arenaId });
      }
   };

   const handleChecked = () => {
      updateStatusMutation.mutate({
         id: item.id,
         isFinished: !item.isFinished,
      });
   };

   if (!item.discipline) return null;

   return (
      <div ref={setNodeRef} style={style} {...attributes}>
         <div
            className={cn(
               "flex items-center gap-x-3 bg-white rounded-xl shadow-light p-2 text-sm min-h-10",
               { "opacity-50": isDragging }
            )}
         >
            <div className="flex items-center justify-center">
               <Checkbox
                  checked={item.isFinished}
                  onCheckedChange={handleChecked}
                  className="size-4"
               />
            </div>
            <div
               className="grow cursor-grab"
               ref={setActivatorNodeRef}
               {...listeners}
            >
               <div>
                  {item.discipline.title}
                  {item.categories.length > 0 && (
                     <span>
                        {" "}
                        (
                        {item.categories
                           .map(item => item.category.title)
                           .join(", ")}
                        )
                     </span>
                  )}
               </div>
            </div>
            <div className="shrink-0">
               <CardOptions
                  showDelete={showDeleteModalHandler}
                  showUpdate={showUpdateModalHandler}
                  isVertical={true}
               />
            </div>
         </div>
      </div>
   );
};

export default AdminCardItem;
