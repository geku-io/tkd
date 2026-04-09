import React from "react";
import { EllipsisVertical, Zap } from "lucide-react";
import { Checkbox } from "../../lib-components/checkbox";
import { ICompetition } from "../../../../types/entities.types";
import { cn } from "../../../../lib/utils";

interface IProps {
   item: ICompetition;
}

const CardOverlay = ({ item }: IProps) => {
   return (
      <div className="flex items-center gap-x-3 bg-white rounded-xl shadow-light p-2 text-sm min-h-10">
         <div className="flex items-center justify-center">
            <Checkbox checked={item.isFinished} className="size-4" />
         </div>

         <div className="grow cursor-grab">
            <div>
               {item.discipline.title}
               {item.categories.length > 0 && (
                  <span>
                     {", "}

                     {item.categories
                        .map(item => item.category.title)
                        .join(", ")}
                  </span>
               )}
            </div>
         </div>
         <div className="flex items-center gap-x-1 shrink-0">
            <div className={cn({ "text-red-accent": item.isLive })}>
               <Zap size={16} />
            </div>
            <EllipsisVertical size={18} />
         </div>
      </div>
   );
};

export default CardOverlay;
