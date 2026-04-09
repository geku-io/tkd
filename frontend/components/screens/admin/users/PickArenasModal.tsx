import React, { useState } from "react";
import ConfirmModal from "../../../UI/modals/ConfirmModal";
import { IModalProps } from "../../../../types/modals.types";
import { useGetModalsContext } from "../../../../contexts/ModalsContext";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogPortal,
   DialogTitle,
} from "../../../UI/lib-components/dialog";
import ActionButton from "../../../UI/buttons/ActionButton";
import { XIcon } from "lucide-react";
import MainPage from "../../main/MainPage";
import { useUpdateEntity } from "../../../../hooks/query";
import { IItemsArr } from "../../../../types/query.types";
import { API } from "../../../../constants/api";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "../../../../lib/fetchApi";
import { IUsersTourArenas } from "../../../../types/entities.types";

const PickArenasModal = ({ isOpen, setIsOpen }: IModalProps) => {
   const queryClient = useQueryClient();
   const { setCurrentId, currentId } = useGetModalsContext<string | null>();
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

   const updateMutation = useUpdateEntity<IItemsArr<string>>({
      id: currentId || null,
      queryKey: [QUERY_KEYS.TOURNAMENTS, QUERY_KEYS.BASE_TOURNAMENTS],
      source: API.USERS_IN_ARENAS,
   });

   const { data: selectedArenas, isFetching } = useQuery({
      queryKey: [QUERY_KEYS.USERS_IN_ARENAS, currentId],
      queryFn: async () => {
         if (currentId) {
            const result = await fetchApi<IUsersTourArenas[]>(
               `${API.USERS_IN_ARENAS}/${currentId}`,
            );
            const selectedResult = result.map(item => item.tournamentsArena.id);
            return selectedResult;
         }
      },
      enabled: !!currentId && !!isOpen,
   });

   const updateUserPermissions = async () => {
      if (selectedArenas) {
         updateMutation.mutate({ items: selectedArenas });
      }
   };

   const showConfirmHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(true);
   };

   const closeCurrentModal = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      if (setCurrentId) {
         if (currentId) {
            queryClient.invalidateQueries({
               queryKey: [QUERY_KEYS.USERS_IN_ARENAS, currentId],
            });
         }
         setCurrentId(null);
      }
      /* if () {
         e.preventDefault();
         showConfirmHandler();
      } else {
         
      } */
   };

   const cancelHandler = () => {
      setIsOpen(true);
      setIsConfirmModalOpen(false);
   };

   const closeHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(false);
   };
   return (
      <ConfirmModal
         title="Вы уверены?"
         description="Все введенные данные будут утеряны"
         actionBtnText="Закрыть"
         confirmedAction={closeHandler}
         cancelHandler={cancelHandler}
         isOpen={isConfirmModalOpen}
         setIsOpen={setIsConfirmModalOpen}
         btnType="delete"
      >
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogPortal>
               <DialogContent
                  showCloseButton={false}
                  className="flex! flex-col! p-0! gap-y-0 bg-white border-none shadow-popover visible opacity-100 transition-opacity max-w-6xl! max-h-[calc(100%-64px)] overflow-hidden"
                  onInteractOutside={e => {
                     e.preventDefault();
                  }}
                  onEscapeKeyDown={e => {
                     e.preventDefault();
                     showConfirmHandler();
                  }}
               >
                  <div className="shadow-main p-6">
                     <DialogTitle className="text-xl font-bold">
                        Создание пользователя
                     </DialogTitle>
                     <DialogDescription>
                        Добавление только уникальных записей
                     </DialogDescription>
                  </div>
                  <div className="shrink grow-0 text-md overflow-y-auto px-6 py-4">
                     <MainPage
                        isInteractive={true}
                        isPending={isFetching}
                        selectedItems={selectedArenas}
                     />
                  </div>
                  <div className="flex items-center justify-end gap-x-2 shadow-main p-6">
                     <DialogClose asChild={true}>
                        <ActionButton
                           btnType="basic"
                           onClick={closeCurrentModal}
                        >
                           Отмена
                        </ActionButton>
                     </DialogClose>
                     <DialogClose asChild={true}>
                        <ActionButton
                           btnType="blue"
                           type="submit"
                           onClick={async e => {
                              e.preventDefault();
                              await updateUserPermissions();
                              closeHandler();
                           }}
                        >
                           Сохранить
                        </ActionButton>
                     </DialogClose>
                  </div>
                  <DialogClose
                     className="ring-offset-background absolute top-4 right-4 rounded-xs opacity-70 transition-opacity size-5 cursor-pointer"
                     asChild={true}
                     onClick={closeCurrentModal}
                  >
                     <XIcon />
                  </DialogClose>
               </DialogContent>
            </DialogPortal>
         </Dialog>
      </ConfirmModal>
   );
};

export default PickArenasModal;
