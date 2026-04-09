import React from "react";
import { useGetModalsContext } from "../../../../contexts/ModalsContext";
import { Link } from "lucide-react";

interface IProps {
   id: string;
}

const PickAction = ({ id }: IProps) => {
   const { setCurrentId, showCreateModal } = useGetModalsContext<string>();
   const clickHandler = () => {
      if (setCurrentId && showCreateModal) {
         setCurrentId(id);
         showCreateModal();
      }
   };
   return (
      <Link
         className="size-5 text-black cursor-pointer"
         onClick={clickHandler}
      />
   );
};

export default PickAction;
