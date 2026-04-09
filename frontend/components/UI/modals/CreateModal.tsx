"use client";

import React, { useState } from "react";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogPortal,
   DialogTitle,
} from "../lib-components/dialog";
import ActionButton from "../buttons/ActionButton";
import CreateForm from "../form/create-form/CreateForm";
import { XIcon } from "lucide-react";
import { defaultCreationData } from "../form/create-form/create-form.constants";
import ConfirmModal from "./ConfirmModal";
import { IModalOptionalContent } from "../../../types/modals.types";
import { IArenaInfo } from "../../../types/query.types";
import { useGetModalsContext } from "../../../contexts/ModalsContext";
import { useCreateEntities } from "../../../hooks/query";
import { useAppForm } from "../../../contexts/AdminFormContext";

interface IProps extends IModalOptionalContent, Partial<IArenaInfo> {
   isAdding?: boolean;
}

const CreateModal = ({
   isOpen,
   setIsOpen,
   source,
   searchSource,
   queryKey,
   isAdding = false,
   title,
   actionBtnText,
   cancelBtnText,
   description,
   arenaId,
   tournamentId,
}: IProps) => {
   const { setCurrentId, setCurrentType } = useGetModalsContext();
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
   const [selectedValues, setSelectedValues] = useState<string[]>([]);

   const restoreModalState = () => {
      if (setCurrentId) {
         setCurrentId(null);
      }
      if (setCurrentType) {
         setCurrentType(null);
      }
   };
   const { mutate: createEntities } = useCreateEntities({
      queryKey,
      source,
      onSettledHandler: restoreModalState,
   });
   const form = useAppForm({
      defaultValues: defaultCreationData,
   });

   const resetForm = () => {
      form.reset();
      setSelectedValues([]);
   };

   const createHandler = () => {
      if (selectedValues.length > 0) {
         createEntities({ titles: selectedValues, arenaId, tournamentId });
         resetForm();
      }
   };

   const showConfirmHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(true);
   };

   const closeCurrentModal = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      if (selectedValues.length > 0) {
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
      resetForm();
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
                     <CreateForm
                        form={form}
                        source={searchSource ? searchSource : source}
                        queryKey={queryKey}
                        value={selectedValues}
                        setValue={setSelectedValues}
                        isAdding={isAdding}
                     />
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

export default CreateModal;
