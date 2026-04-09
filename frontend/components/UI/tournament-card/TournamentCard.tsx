import React from "react";
import { ICompetition } from "../../../types/entities.types";
import { cn } from "../../../lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { useGetModalsContext } from "../../../contexts/ModalsContext";

interface IProps {
   competitions: ICompetition[];
   tournamentId: string;
   arenaId: string;
   isInteractive?: boolean;
   isSelected?: boolean;
}

const TournamentCard = ({
   competitions,
   isInteractive,
   arenaId,
   isSelected,
}: IProps) => {
   const { currentId } = useGetModalsContext<string>();
   const queryClient = useQueryClient();
   const sortedCompetitions = competitions
      .slice()
      .sort(
         (a, b) =>
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );

   const finishedCompetitions = sortedCompetitions.filter(
      item => item.isFinished,
   );
   const filteredCompetitions = finishedCompetitions.concat(
      sortedCompetitions.filter(item => !item.isFinished),
   );
   const handleClick = () => {
      if (isInteractive && currentId) {
         queryClient.setQueryData<string[]>(
            [QUERY_KEYS.USERS_IN_ARENAS, currentId],
            old => {
               if (!old) return;
               if (old.includes(arenaId)) {
                  return old.filter(item => item !== arenaId);
               } else {
                  return old.concat(arenaId);
               }
            },
         );
      }
   };
   return (
      <div
         className={cn(
            "bg-light-gray rounded-xl min-h-40 transition border-2 border-transparent",
            {
               "cursor-pointer": isInteractive,
               "shadow-border": !isSelected,
               "border-blue-accent": isSelected,
            },
         )}
         onClick={handleClick}
      >
         <div className="flex flex-col h-full text-black py-4 px-2">
            <div className="flex items-center justify-between mb-4">
               <div className="font-medium pl-2">
                  {competitions[0].arena.title}
               </div>
            </div>
            <div className="grow flex flex-col">
               <div className="grow">
                  {filteredCompetitions.length > 0 && (
                     <div className="flex flex-col gap-y-3">
                        {filteredCompetitions.map((item, index) => (
                           <div key={item.id} className="px-2 text-sm">
                              <div className="flex items-start gap-x-1">
                                 <span>{index + 1}.</span>
                                 <div className="grow flex gap-x-2 items-start justify-between">
                                    <div
                                       className={cn("grow", {
                                          "line-through": item.isFinished,
                                       })}
                                    >
                                       {item.discipline.title}
                                       {item.categories.length > 0 && (
                                          <div className="inline">
                                             <span>
                                                {", "}
                                                {item.categories
                                                   .map(
                                                      item =>
                                                         item.category.title,
                                                   )
                                                   .join(", ")}
                                             </span>
                                          </div>
                                       )}
                                    </div>
                                    {item.isLive && (
                                       <div
                                          className={cn(
                                             "relative text-red-accent font-medium pl-2",
                                             "before:absolute before:content-[''] before:top-1/2 before:left-0 before:-translate-y-1/2 before:bg-red-accent before:size-[6px] before:rounded-full",
                                          )}
                                       >
                                          Live
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default TournamentCard;
