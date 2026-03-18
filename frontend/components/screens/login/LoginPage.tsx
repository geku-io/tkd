"use client";
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { fetchApi } from "../../../lib/fetchApi";
import { API } from "../../../constants/api";
import { ROUTES } from "../../../constants/routes";
import { useAppForm } from "../../../contexts/AdminFormContext";

const loginSchema = z.object({
   name: z.string().min(1, "Это обязательное поле"),
   password: z.string().min(1, "Это обязательное поле"),
});

type IUserData = z.infer<typeof loginSchema>;

export const defaultLoginData: IUserData = {
   name: "",
   password: "",
};

const LoginPage = () => {
   const router = useRouter();
   const login = useMutation({
      mutationFn: async (body: IUserData) => {
         const res = await fetchApi(API.LOGIN, {
            method: "POST",
            body: JSON.stringify(body),
         });
         return res;
      },

      onSuccess: () => {
         router.push(ROUTES.HOME);
      },

      onError: () => {
         toast.error("Ошибка при входе");
      },
   });
   const form = useAppForm({
      defaultValues: defaultLoginData,
      onSubmit: ({ value }) => {
         login.mutate(value);
      },
      validators: {
         onChange: loginSchema,
         onBlur: loginSchema,
      },
   });

   return (
      <div className="size-full flex items-center justify-center overflow-hidden px-4">
         <div className="max-sm:w-full max-sm:max-w-80 sm:min-w-[450px] bg-white border-none rounded-xl shadow-popover visible opacity-100 transition-opacity sm:p-6 p-4">
            <h2 className="mb-2">Вход в систему</h2>
            <form
               onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
               }}
               className="w-full"
               autoComplete="on"
            >
               <div className="flex flex-col gap-y-4 mb-8">
                  <form.AppField name="name">
                     {field => {
                        return (
                           <field.BaseFormInput
                              autoComplete="username"
                              label="Имя пользователя *"
                           />
                        );
                     }}
                  </form.AppField>
                  <form.AppField name="password">
                     {field => {
                        return (
                           <field.BaseFormInput
                              autoComplete="current-password"
                              type="password"
                              label="Пароль *"
                           />
                        );
                     }}
                  </form.AppField>
               </div>
               <div className="w-full flex justify-end">
                  <form.AppForm>
                     <form.SubmitButton title="Войти" size="default" />
                  </form.AppForm>
               </div>
            </form>
         </div>
      </div>
   );
};

export default LoginPage;
