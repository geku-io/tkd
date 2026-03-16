import { X } from "lucide-react";
import React from "react";

interface IProps {
   clickHandler: () => void;
   className?: string;
}

const Cross = ({ clickHandler, className }: IProps) => {
   return (
      <button className={className} onClick={clickHandler}>
         <X className="transition text-black hover:text-black/70 size-5" />
      </button>
   );
};

export default Cross;
