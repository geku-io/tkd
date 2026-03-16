"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "../../../lib/utils";
import { ROUTES } from "../../../constants/routes";

interface IProps {
   className?: string;
}

const BackButton = ({ className }: IProps) => {
   const router = useRouter();
   const pathname = usePathname();
   const pathArr = pathname.split("/");
   if (pathArr.length <= 2) {
      return null;
   }
   return (
      <button
         type="button"
         className={cn("flex items-center gap-x-2 text-blue-accent", className)}
         onClick={() => {
            if (pathArr.length < 4) {
               router.push(ROUTES.HOME);
            } else {
               router.back();
            }
         }}
      >
         <ArrowLeft size={20} />
         <div className="font-medium">Назад</div>
      </button>
   );
};

export default BackButton;
