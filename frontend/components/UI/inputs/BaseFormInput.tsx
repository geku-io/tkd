"use client";

import React, { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useFieldContext } from "../../../contexts/AdminFormContext";
import { cn } from "../../../lib/utils";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
   ref?: React.RefObject<HTMLInputElement | null>;
   label: string;
}

const BaseFormInput = ({ label, type, ref, ...rest }: IProps) => {
   const [isShowPassword, setIsShowPassword] = useState(false);
   const id = useId();
   const field = useFieldContext<string | string[]>();

   const fieldMeta = field.state.meta;

   const isValid = fieldMeta.isValid || !fieldMeta.isBlurred;

   return (
      <div className="w-full">
         <label
            htmlFor={id}
            className={cn("inline-block mb-1 text-sm", {
               "text-red-accent": !isValid,
            })}
         >
            {label}
         </label>
         <div
            className={cn(
               "w-full sm:h-9 h-8 px-3 min-w-0 rounded-md border bg-transparent sm:py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
               {
                  "flex items-center justify-between gap-x-2":
                     type === "password",
               },
               {
                  "border-red-accent text-red-accent focus-within:border-red-accent focus-within:ring-red-accent/80":
                     !isValid,
               }
            )}
         >
            <input
               ref={ref}
               className="w-full h-full sm:text-base text-sm"
               type={
                  type === "password"
                     ? isShowPassword
                        ? "text"
                        : "password"
                     : type
               }
               id={id}
               defaultValue={field.state.value}
               onBlur={field.handleBlur}
               onChange={e => {
                  field.handleChange(e.target.value);
                  field.validate("blur");
               }}
               {...rest}
            />
            {type === "password" && (
               <div
                  className="size-[18px] cursor-pointer"
                  onClick={() => setIsShowPassword(prev => !prev)}
               >
                  {isShowPassword ? (
                     <EyeOff className="size-full" />
                  ) : (
                     <Eye className="size-full" />
                  )}
               </div>
            )}
         </div>
         {!isValid && (
            <em role="alert" className="text-red-accent text-sm">
               {fieldMeta.errors[0]?.message}
            </em>
         )}
      </div>
   );
};

export default BaseFormInput;
