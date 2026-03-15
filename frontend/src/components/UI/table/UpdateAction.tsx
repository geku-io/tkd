import React from "react";
import { Pen } from "lucide-react";
import { useGetModalsContext } from "@/contexts/ModalsContext";

interface IProps {
   id: string;
}

const UpdateAction = ({ id }: IProps) => {
   const { setCurrentId, showUpdateModal } = useGetModalsContext<string>();
   const clickHandler = () => {
      if (setCurrentId && showUpdateModal) {
         setCurrentId(id);
         showUpdateModal();
      }
   };
   return (
      <Pen
         className="size-5 text-black cursor-pointer"
         onClick={clickHandler}
      />
   );
};

export default UpdateAction;
