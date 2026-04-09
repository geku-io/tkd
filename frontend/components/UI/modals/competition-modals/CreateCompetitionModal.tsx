"use client";

import React, { useState } from "react";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogPortal,
   DialogTitle,
} from "../../lib-components/dialog";
import ActionButton from "../../buttons/ActionButton";
import { XIcon } from "lucide-react";
import ConfirmModal from "../ConfirmModal";
import { defaultCreationCompData } from "../../form/competition-form/competition-form.contstants";
import CompetitionForm from "../../form/competition-form/CompetitionForm";
import { IModalOptionalContent } from "../../../../types/modals.types";
import { useGetModalsContext } from "../../../../contexts/ModalsContext";
import { useCreateEntities } from "../../../../hooks/query";
import { ICreateCompetitionBody } from "../../../../types/query.types";
import { API } from "../../../../constants/api";
import { useAppForm } from "../../../../contexts/AdminFormContext";

interface IProps extends IModalOptionalContent {
   isAdding?: boolean;
   tournamentId?: string;
   arenaId?: string;
}

const CreateCompetitionModal = ({
   isOpen,
   setIsOpen,
   title,
   actionBtnText,
   cancelBtnText,
   description,
   tournamentId,
   arenaId,
   queryKey,
}: IProps) => {
   const { setCurrentId, setCurrentType } = useGetModalsContext();
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

   const restoreModalState = () => {
      if (setCurrentId) {
         setCurrentId(null);
      }
      if (setCurrentType) {
         setCurrentType(null);
      }
   };

   const { mutate: createEntities } = useCreateEntities<ICreateCompetitionBody>(
      {
         source: API.COMPETITIONS,
         queryKey,
         onSettledHandler: restoreModalState,
      },
   );
   const form = useAppForm({
      defaultValues: defaultCreationCompData,
   });

   const createHandler = () => {
      const formState = form.state.values;
      if (formState.discipline !== "" && tournamentId && arenaId) {
         createEntities({
            tournamentId: tournamentId,
            arenas: [
               {
                  arenaId: arenaId,
                  info: [
                     {
                        discipline: formState.discipline,
                        categories: formState.categories,
                     },
                  ],
               },
            ],
         });
         form.reset();
      }
   };

   const showConfirmHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(true);
   };

   const closeCurrentModal = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      const formState = form.state.values;
      if (formState.categories.length > 0 || formState.discipline !== "") {
         e.preventDefault();
         showConfirmHandler();
      } else {
         restoreModalState();
      }
   };

   const cancelHandler = () => {
      setIsOpen(true);
      setIsConfirmModalOpen(false);
   };

   const closeHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(false);
      form.reset();
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
                  className="bg-white border-none shadow-popover visible opacity-100 transition-opacity"
                  onInteractOutside={e => {
                     e.preventDefault();
                  }}
                  onEscapeKeyDown={e => {
                     e.preventDefault();
                     showConfirmHandler();
                  }}
               >
                  <DialogTitle className="text-xl font-bold">
                     {title ? title : "Создание записей"}
                  </DialogTitle>
                  <DialogDescription>
                     {description
                        ? description
                        : "Добавление только уникальных записей"}
                  </DialogDescription>
                  <div className="text-md mb-4">
                     <CompetitionForm form={form} />
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
                     <DialogClose asChild={true}>
                        <ActionButton
                           btnType="basic"
                           onClick={closeCurrentModal}
                        >
                           {cancelBtnText ? cancelBtnText : "Отмена"}
                        </ActionButton>
                     </DialogClose>
                     <DialogClose asChild={true}>
                        <ActionButton btnType="blue" onClick={createHandler}>
                           {actionBtnText ? actionBtnText : "Создать"}
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

export default CreateCompetitionModal;
