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
   return (
      <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting]}>
         {([canSubmit, isSubmitting]) => (
            <ActionButton
               size={size}
               className={cn("rounded-lg sm:text-base text-sm", className)}
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
