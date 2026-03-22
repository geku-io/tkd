import React from "react";
import styles from "./Sidebar.module.css";
import { cn } from "../../../../lib/utils";
import { SetStateType } from "../../../../types/main.types";
import ActionButton from "../../../UI/buttons/ActionButton";

interface IProps {
   isOpen: boolean;
   setIsOpen: SetStateType<boolean>;
   username: string;
   logout: () => void;
}

const MobileHeader = ({ isOpen, setIsOpen, username, logout }: IProps) => {
   return (
      <>
         <div className={styles.header}>
            <div className={styles["header-wrapper"]}>
               <div className="flex items-center h-full justify-end pr-6 gap-x-2">
                  <div className="text-base font-bold">{username}</div>
                  <ActionButton action={logout} size="sm">
                     Выйти
                  </ActionButton>
               </div>
            </div>
         </div>
         <div
            className={cn(styles["burger-wrapper"], {
               [styles["_open"]]: isOpen,
            })}
         >
            <div className={styles.burger} onClick={() => setIsOpen(!isOpen)}>
               <span></span>
            </div>
         </div>
      </>
   );
};

export default MobileHeader;
