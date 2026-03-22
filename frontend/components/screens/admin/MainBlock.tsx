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
         <div className="min-h-full h-auto w-full lg:py-14 py-8 lg:px-22 pl-20 pr-8 bg-white lg:border lg:border-border rounded-xl">
            <BackButton className="mb-2" />
            {title && (
               <div
                  className={cn(
                     "mb-12",
                     {
                        "flex gap-x-6 justify-between items-start": !!actions,
                     },
                     className
                  )}
               >
                  <div>
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
