import React from "react";
import { ICompetition } from "../../../types/entities.types";

interface IProps {
   competitions: ICompetition[];
   tournamentId: string;
}

const TournamentCard = ({ competitions }: IProps) => {
   return (
      <div className="bg-light-gray rounded-xl min-h-40 shadow-border">
         <div className="flex flex-col h-full text-black py-4 px-2">
            <div className="flex items-center justify-between mb-4">
               <div className="font-medium pl-2">
                  {competitions[0].arena.title}
               </div>
            </div>
            <div className="grow flex flex-col">
               <div className="grow">
                  {competitions.length > 0 && (
                     <div className="flex flex-col gap-y-3">
                        {competitions.map((item, index) => (
                           <div key={item.id} className="px-2 text-sm">
                              <div className="flex items-start gap-x-1">
                                 <span>{index + 1}.</span>
                                 <div>
                                    {item.discipline.title}
                                    {item.categories.length > 0 && (
                                       <span>
                                          {" "}
                                          (
                                          {item.categories
                                             .map(item => item.category.title)
                                             .join(", ")}
                                          )
                                       </span>
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
