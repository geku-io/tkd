import React from "react";
import { Trash } from "lucide-react";
import { useGetModalsContext } from "@/contexts/ModalsContext";

interface IProps {
   id: string;
}

const DeleteAction = ({ id }: IProps) => {
   const { setCurrentId, showDeleteModal } = useGetModalsContext<string>();
   const clickHandler = () => {
      if (setCurrentId && showDeleteModal) {
         setCurrentId(id);
         showDeleteModal();
      }
   };
   return (
      <>
         <Trash
            onClick={clickHandler}
            className="size-5 cursor-pointer text-red-accent"
         />
      </>
   );
};

export default DeleteAction;
