"use client";

import React from "react";
import { Spinner } from "../lib-components/spinner";
import ActionButton from "../buttons/ActionButton";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "../buttons/button";
import { useFormContext } from "../../../contexts/AdminFormContext";
import { cn } from "../../../lib/utils";

interface IProps extends VariantProps<typeof buttonVariants> {
   className?: string;
   submittingTitle?: string;
   title?: string;
}

const SubmitButton = ({
   submittingTitle = "Сохранение",
   title = "Сохранить",
   size = "lg",
   className,
}: IProps) => {
   const form = useFormContext();
   const heightStyle = {
      "h-10": size === "default",
      "h-8 text-sm": size === "sm",
      "h-12": size === "lg",
      "size-9": size === "icon",
      "size-8": size === "icon-sm",
      "size-10": size === "icon-lg",
   };
   return (
      <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
         {([canSubmit, isSubmitting]) => (
            <ActionButton
               className={cn("rounded-lg text-lg", heightStyle, className)}
               action={() => {
                  form.handleSubmit();
               }}
               disabled={!canSubmit || isSubmitting}
               aria-disabled={!canSubmit || isSubmitting}
            >
               {isSubmitting ? (
                  <div className="flex items-center gap-x-2">
                     <Spinner />
                     <div>{submittingTitle}</div>
                  </div>
               ) : (
                  <>{title}</>
               )}
            </ActionButton>
         )}
      </form.Subscribe>
   );
};

export default SubmitButton;
