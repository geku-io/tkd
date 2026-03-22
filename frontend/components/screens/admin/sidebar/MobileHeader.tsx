import React from "react";
import styles from "./Sidebar.module.css";
import { cn } from "../../../../lib/utils";
import { SetStateType } from "../../../../types/main.types";

interface IProps {
   isOpen: boolean;
   setIsOpen: SetStateType<boolean>;
}

const MobileHeader = ({ isOpen, setIsOpen }: IProps) => {
   return (
      <div
         className={cn(styles["burger-wrapper"], {
            [styles["_open"]]: isOpen,
         })}
      >
         <div className={styles.burger} onClick={() => setIsOpen(!isOpen)}>
            <span></span>
         </div>
      </div>
   );
};

export default MobileHeader;
