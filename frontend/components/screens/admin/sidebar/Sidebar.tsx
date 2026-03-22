"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ISession } from "../../../../types/main.types";
import { menuItems } from "../../../../constants/dashboard-menu";
import { checkAuth } from "../../../../utils/checkAuth";
import { ROUTES, ROUTES_ROLES } from "../../../../constants/routes";
import { fetchApi } from "../../../../lib/fetchApi";
import { API } from "../../../../constants/api";
import { cn } from "../../../../lib/utils";
import MobileHeader from "./MobileHeader";
import styles from "./Sidebar.module.css";

const Sidebar = ({ session }: ISession) => {
   const [isOpen, setIsOpen] = useState(false);
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
   const closeHandler = () => {
      setIsOpen(false);
   };
   return (
      <div
         className={cn(styles.sidebar, {
            [styles["_open"]]: isOpen,
         })}
      >
         <div className={styles.wrapper}>
            <div className="h-full flex flex-col">
               <Link
                  href={ROUTES.HOME}
                  onClick={closeHandler}
                  className="flex items-center sm:gap-x-3 gap-x-2 sm:pl-6 max-sm:px-2 sm:pb-8 pb-4 border-b border-zinc-400/20"
               >
                  <div className="relative sm:size-[50px] size-10 shrink-0">
                     <Image fill={true} src="/tkd-logo.png" alt="ГТФ РТ" />
                  </div>
                  <div className="font-bold sm:text-sm text-xs">
                     Федерация Тхэквондо ГТФ Республики Татарстан
                  </div>
               </Link>
               <menu className="grow sm:pt-12 pt-6 pb-8 overflow-auto">
                  <ul>
                     {filteredRoutes.map(item => (
                        <li
                           key={item.title}
                           className="sm:px-6 px-2 sm:h-12 h-10"
                        >
                           <Link
                              href={ROUTES[item.link]}
                              onClick={closeHandler}
                              className={cn(
                                 "h-full flex items-center gap-x-2 pl-4 text-[#7e7e80] hover:bg-gray hover:text-black rounded-xl transition-colors",
                                 {
                                    "bg-gray text-black":
                                       pathname === ROUTES[item.link],
                                 }
                              )}
                           >
                              <item.logo className="sm:size-6 size-5" />
                              <div className="sm:text-lg text-base font-medium">
                                 {item.title}
                              </div>
                           </Link>
                        </li>
                     ))}
                  </ul>
               </menu>
               <div className="flex items-center justify-between sm:px-6 px-4 sm:pt-6 pt-4 border-t border-zinc-400/20">
                  <div>
                     <div className="sm:text-base text-sm font-bold">
                        {session.name}
                     </div>
                  </div>
                  <button
                     type="button"
                     className="text-black transition-colors hover:text-red-accent"
                     onClick={async () => {
                        await logoutHandler();
                     }}
                  >
                     <LogOut className="sm:size-6 size-5" />
                  </button>
               </div>
            </div>
         </div>
         <MobileHeader
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            logout={async () => {
               await logoutHandler();
            }}
         />
      </div>
   );
};

export default Sidebar;
