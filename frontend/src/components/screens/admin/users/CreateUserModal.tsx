import React, { useState } from "react";
import ActionButton from "@/components/UI/buttons/ActionButton";
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogDescription,
   DialogPortal,
   DialogTitle,
} from "@/components/UI/lib-components/dialog";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/UI/lib-components/select";
import ConfirmModal from "@/components/UI/modals/ConfirmModal";
import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useAppForm } from "@/contexts/AdminFormContext";
import { fetchApi } from "@/lib/fetchApi";
import { queryClient } from "@/providers/QueryProvider";
import {
   IUserCredentials,
   UserRole,
   UserRoleTitle,
} from "@/types/entities.types";
import { IModalProps } from "@/types/modals.types";
import { useMutation } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { toast } from "sonner";
import { useGetModalsContext } from "@/contexts/ModalsContext";

export const defaultUserData: IUserCredentials = {
   name: "",
   role: UserRole.EDITOR,
   password: "",
};

const CreateUserModal = ({ isOpen, setIsOpen }: IModalProps) => {
   const { setCurrentId } = useGetModalsContext<string | null>();
   const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

   const form = useAppForm({
      defaultValues: defaultUserData,
      onSubmit: ({ value }) => {
         createUser(value);
      },
   });

   const resetForm = () => {
      form.reset();
   };

   const { mutate: createUser } = useMutation({
      mutationFn: async (body: IUserCredentials) => {
         const res = await fetchApi(API.USERS, {
            method: "POST",
            body: JSON.stringify(body),
         });
         return res;
      },

      onSuccess: () => {
         toast.success("Соревнования успешно созданы");
         queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.USERS],
         });
         resetForm();
      },

      onError: () => {
         toast.error("Ошибка при создании");
      },
   });

   const createHandler = async () => {
      await form.handleSubmit();
   };

   const showConfirmHandler = () => {
      setIsOpen(false);
      setIsConfirmModalOpen(true);
   };

   const closeCurrentModal = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
   ) => {
      if (form.state.values.name !== "" && form.state.values.password !== "") {
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
                     Создание пользователя
                  </DialogTitle>
                  <DialogDescription>
                     Добавление только уникальных записей
                  </DialogDescription>
                  <div className="text-md mb-4">
                     <form
                        onSubmit={e => {
                           e.preventDefault();
                           e.stopPropagation();
                        }}
                        className="w-full"
                        autoComplete="off"
                     >
                        <div className="flex flex-col gap-y-4 mb-8">
                           <form.AppField name="name">
                              {field => {
                                 return (
                                    <field.BaseFormInput
                                       label="Имя пользователя *"
                                       autoComplete="new-password"
                                    />
                                 );
                              }}
                           </form.AppField>
                           <form.AppField name="role">
                              {field => {
                                 return (
                                    <div className="w-full">
                                       <div className="inline-block mb-1 text-sm">
                                          Роль *
                                       </div>
                                       <Select
                                          value={field.state.value}
                                          onValueChange={(value: UserRole) =>
                                             field.handleChange(value)
                                          }
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
                                                   )
                                                )}
                                             </SelectGroup>
                                          </SelectContent>
                                       </Select>
                                    </div>
                                 );
                              }}
                           </form.AppField>
                           <form.AppField name="password">
                              {field => {
                                 return (
                                    <field.BaseFormInput
                                       type="password"
                                       label="Пароль *"
                                       autoComplete="new-password"
                                    />
                                 );
                              }}
                           </form.AppField>
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
                              await createHandler();
                              closeHandler();
                           }}
                        >
                           Создать
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

export default CreateUserModal;
