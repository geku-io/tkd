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
import { XIcon } from "lucide-react";
import UpdateForm from "../form/update-form/UpdateForm";
import ConfirmModal from "./ConfirmModal";
import { IModalOptionalContent } from "../../../types/modals.types";
import { useGetModalsContext } from "../../../contexts/ModalsContext";
import { useGetEntity, useUpdateEntity } from "../../../hooks/query";
import { useAppForm } from "../../../contexts/AdminFormContext";

interface IProps extends IModalOptionalContent {
   id: string | null;
}

const UpdateModal = ({
   isOpen,
   setIsOpen,
   source,
   queryKey,
   id,
   title,
   description,
   searchSource,
   actionBtnText,
   cancelBtnText,
}: IProps) => {
   const { setCurrentId } = useGetModalsContext();
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
   const { data, isFetching } = useGetEntity({
      queryKey,
      source,
      id,
      enabled: !!isOpen,
   });

   const { mutate: updateMutation } = useUpdateEntity({ queryKey, source, id });

   const form = useAppForm({
      defaultValues: {
         title: data?.title ?? "",
      },
   });

   const showConfirmHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(true);
   };

   const closeCurrentModal = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
   ) => {
      if (data && data.title !== form.state.values.title) {
         e.preventDefault();
         showConfirmHandler();
      } else {
         if (setCurrentId) {
            setCurrentId(null);
         }
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

   const updateHandler = () => {
      const fieldValue = form.state.values.title;
      if (data && id) {
         if (data.title !== fieldValue) {
            updateMutation({ title: fieldValue });
         }
         if (setCurrentId) {
            setCurrentId(null);
         }
      }
   };
   return (
      <ConfirmModal
         title="Вы уверены?"
         description="Измененные данные не сохранятся. Отменить изменения?"
         actionBtnText="Закрыть"
         cancelBtnText="Продолжить"
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
                     {title ? title : "Изменение"}
                  </DialogTitle>
                  <DialogDescription>
                     {description ? description : "Измение данных записи"}
                  </DialogDescription>
                  <div className="text-md mb-4">
                     <UpdateForm
                        form={form}
                        source={searchSource ? searchSource : source}
                        queryKey={queryKey}
                        isPending={isFetching}
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
                        <ActionButton btnType="blue" onClick={updateHandler}>
                           {actionBtnText ? actionBtnText : "Подтвердить"}
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

export default UpdateModal;
