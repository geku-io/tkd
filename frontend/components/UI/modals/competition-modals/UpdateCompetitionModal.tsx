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
import CompetitionForm from "../../form/competition-form/CompetitionForm";
import { IModalOptionalContent } from "../../../../types/modals.types";
import { useGetModalsContext } from "../../../../contexts/ModalsContext";
import { useGetEntity, useUpdateEntity } from "../../../../hooks/query";
import { ICompetitionInfo } from "../../../../types/query.types";
import { ICompetition } from "../../../../types/entities.types";
import { useAppForm } from "../../../../contexts/AdminFormContext";

interface IProps extends IModalOptionalContent {
   id: string | null;
   isAdding?: boolean;
}

const UpdateCompetitionModal = ({
   isOpen,
   setIsOpen,
   title,
   actionBtnText,
   cancelBtnText,
   description,
   queryKey,
   source,
   id,
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

   const { mutate: updateMutation } = useUpdateEntity<ICompetitionInfo>({
      onSettledHandler: restoreModalState,
      queryKey,
      source,
      id,
   });

   const { data, isFetching } = useGetEntity<ICompetition>({
      queryKey,
      source,
      id,
      enabled: !!isOpen,
   });

   const form = useAppForm({
      defaultValues: {
         discipline: data?.discipline.title ?? "",
         categories: data?.categories.map(item => item.category.title) ?? [],
      },
   });

   const updateHandler = () => {
      const formState = form.state.values;
      if (formState.discipline !== "") {
         updateMutation({
            discipline: formState.discipline,
            categories: formState.categories,
         });
      }
   };

   const showConfirmHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(true);
   };

   const closeCurrentModal = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
   ) => {
      const formState = form.state.values;
      if (
         formState.discipline !== data?.discipline.title &&
         data?.categories.join(",") !== formState.categories.join(",")
      ) {
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
                     <CompetitionForm form={form} isPending={isFetching} />
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
                        <ActionButton btnType="blue" onClick={updateHandler}>
                           {actionBtnText ? actionBtnText : "Изменить"}
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

export default UpdateCompetitionModal;
