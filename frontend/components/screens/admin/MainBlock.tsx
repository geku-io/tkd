import React from "react";
import BackButton from "../../UI/buttons/BackButton";
import { cn } from "../../../lib/utils";

interface IProps {
   children: React.ReactNode;
   title?: string;
   subTitle?: string;
   actions?: React.JSX.Element | React.ReactNode;
   className?: string;
}

const MainBlock = ({
   title,
   subTitle,
   children,
   actions,
   className,
}: IProps) => {
   return (
      <div className="h-full grow lg:pt-4 lg:pr-4">
         <div className="min-h-full h-auto w-full lg:py-14 pt-20 pb-10 xl:px-22 lg:px-12 sm:px-6 px-4 bg-white lg:border lg:border-border rounded-xl">
            <BackButton className="sm:mb-2 mb-1" />
            {title && (
               <div
                  className={cn(
                     "lg:mb-12 mb-8",
                     {
                        "md:flex md:gap-x-6 md:justify-between md:items-start":
                           !!actions,
                     },
                     className,
                  )}
               >
                  <div className="max-md:mb-4">
                     <h1>{title}</h1>
                     {subTitle && (
                        <div className="mt-2 text-sm">{subTitle}</div>
                     )}
                  </div>
                  {actions && <>{actions}</>}
               </div>
            )}
            <div>{children}</div>
         </div>
      </div>
   );
};

export default MainBlock;
