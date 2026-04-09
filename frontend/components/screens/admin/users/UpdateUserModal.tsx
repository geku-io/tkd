"use client";

import React, { useState } from "react";
import { XIcon } from "lucide-react";
import {
   IUser,
   IUserCredentials,
   UserRole,
   UserRoleTitle,
} from "../../../../types/entities.types";
import { IModalProps } from "../../../../types/modals.types";
import { useGetModalsContext } from "../../../../contexts/ModalsContext";
import { useGetEntity, useUpdateEntity } from "../../../../hooks/query";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { API } from "../../../../constants/api";
import { useAppForm } from "../../../../contexts/AdminFormContext";
import ConfirmModal from "../../../UI/modals/ConfirmModal";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogPortal,
   DialogTitle,
} from "../../../UI/lib-components/dialog";
import { Skeleton } from "../../../UI/lib-components/skeleton";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "../../../UI/lib-components/select";
import ActionButton from "../../../UI/buttons/ActionButton";

export const defaultUserData: IUserCredentials = {
   name: "",
   role: UserRole.EDITOR,
   password: "",
};

const UpdateUserModal = ({ isOpen, setIsOpen }: IModalProps) => {
   const { currentId, setCurrentId } = useGetModalsContext<string | null>();
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
   const { data, isFetching } = useGetEntity<IUser>({
      id: currentId as string,
      queryKey: QUERY_KEYS.USERS,
      source: API.USERS,
      enabled: !!isOpen && !!currentId,
   });

   const { mutate: updateUser } = useUpdateEntity<Partial<IUser>>({
      id: currentId || null,
      queryKey: QUERY_KEYS.USERS,
      source: API.USERS,
   });

   const form = useAppForm({
      defaultValues: {
         name: data?.name ?? "",
         role: data?.role ?? UserRole.EDITOR,
         password: data?.password ?? "",
      },
      onSubmit: ({ value }) => {
         updateUser({
            ...value,
            password: value.password ? value.password : undefined,
         });
      },
   });

   const resetForm = () => {
      form.reset();
   };

   const updateHandler = async () => {
      await form.handleSubmit();
   };

   const showConfirmHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(true);
   };

   const closeCurrentModal = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
   ) => {
      if (
         data &&
         (data.name !== form.state.values.name ||
            data.role !== form.state.values.role ||
            form.state.values.password !== "")
      ) {
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
                     Изменение пользователя
                  </DialogTitle>
                  <DialogDescription>
                     Изменяй роли, имена и пароли пользователей
                  </DialogDescription>
                  <div className="text-md mb-4">
                     <form
                        onSubmit={e => {
                           e.preventDefault();
                           e.stopPropagation();
                        }}
                        className="w-full"
                     >
                        <div className="flex flex-col gap-y-4 mb-8">
                           {isFetching ? (
                              <Skeleton className="w-full h-8" />
                           ) : (
                              <form.AppField name="name">
                                 {field => {
                                    return (
                                       <field.BaseFormInput label="Имя пользователя *" />
                                    );
                                 }}
                              </form.AppField>
                           )}
                           <form.AppField name="role">
                              {field => {
                                 return (
                                    <div className="w-full">
                                       <div className="inline-block mb-1 text-sm">
                                          Роль *
                                       </div>
                                       <Select
                                          value={field.state.value}
                                          defaultValue={field.state.value}
                                          onValueChange={(value: UserRole) => {
                                             field.handleChange(value);
                                          }}
                                       >
                                          <SelectTrigger className="w-full">
                                             <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent
                                             className="w-full border-none shadow-popover bg-white"
                                             position="popper"
                                          >
                                             <SelectGroup>
                                                {Object.values(UserRole).map(
                                                   item => (
                                                      <SelectItem
                                                         className="bg-white cursor-pointer transition-all hover:bg-light-gray"
                                                         key={item}
                                                         value={item}
                                                      >
                                                         {UserRoleTitle[item]}
                                                      </SelectItem>
                                                   ),
                                                )}
                                             </SelectGroup>
                                          </SelectContent>
                                       </Select>
                                    </div>
                                 );
                              }}
                           </form.AppField>
                           {isFetching ? (
                              <Skeleton className="w-full h-8" />
                           ) : (
                              <form.AppField name="password">
                                 {field => {
                                    return (
                                       <field.BaseFormInput
                                          autoComplete="new-password"
                                          type="password"
                                          label="Новый Пароль"
                                       />
                                    );
                                 }}
                              </form.AppField>
                           )}
                        </div>
                     </form>
                  </div>
                  <div className="flex items-center justify-end gap-x-2">
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
                              await updateHandler();
                              closeHandler();
                           }}
                        >
                           Изменить
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

export default UpdateUserModal;
