"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ISession } from "../../../types/main.types";
import { menuItems } from "../../../constants/dashboard-menu";
import { checkAuth } from "../../../utils/checkAuth";
import { ROUTES, ROUTES_ROLES } from "../../../constants/routes";
import { fetchApi } from "../../../lib/fetchApi";
import { API } from "../../../constants/api";
import { cn } from "../../../lib/utils";

const Sidebar = ({ session }: ISession) => {
   const pathname = usePathname();
   const router = useRouter();
   const filteredRoutes = menuItems.filter(val =>
      checkAuth(session.role, ROUTES_ROLES[val.link])
   );
   const logoutHandler = async () => {
      const res = await fetchApi(API.LOGOUT, {
         method: "POST",
      });
      router.replace(ROUTES.LOGIN);
      return res;
   };
   return (
      <div
         className={cn(
            "h-full shrink-0 basis-[320px] py-4 bg-light-white",
            "max-lg:fixed max-lg:top-0 max-lg:left-0"
         )}
      >
         <div className="h-full flex flex-col">
            <Link
               href={ROUTES.HOME}
               className="flex items-center gap-x-3 pl-6 pb-8 border-b border-zinc-400/20"
            >
               <Image height={50} width={50} src="/tkd-logo.png" alt="ГТФ РТ" />
               <div className="font-bold text-sm">
                  Федерация Тхэквондо ГТФ Республики Татарстан
               </div>
            </Link>
            <menu className="grow pt-12 pb-8 overflow-auto">
               <ul>
                  {filteredRoutes.map(item => (
                     <li key={item.title} className="px-6 h-12">
                        <Link
                           href={ROUTES[item.link]}
                           className={cn(
                              "h-full flex items-center gap-x-2 pl-4 text-[#7e7e80] hover:bg-gray hover:text-black rounded-xl transition-colors",
                              {
                                 "bg-gray text-black":
                                    pathname === ROUTES[item.link],
                              }
                           )}
                        >
                           <item.logo />
                           <div className="text-lg font-medium">
                              {item.title}
                           </div>
                        </Link>
                     </li>
                  ))}
               </ul>
            </menu>
            <div className="flex items-center justify-between px-6 pt-6 border-t border-zinc-400/20">
               <div>
                  <div className="font-bold">{session.name}</div>
               </div>
               <button
                  type="button"
                  className="text-black transition-colors hover:text-red-accent"
                  onClick={async () => {
                     await logoutHandler();
                  }}
               >
                  <LogOut />
               </button>
            </div>
         </div>
      </div>
   );
};

export default Sidebar;
