import React, { useEffect } from "react";
import styles from "./Tournament.module.css";
import TournamentCard from "./TournamentCard";
import { ITournament } from "../../../types/entities.types";
import { useGetSocketContext } from "../../../providers/SocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { cn } from "../../../lib/utils";

interface IProps {
   tournaments: ITournament[];
   isInteractive?: boolean;
   selectedItems?: string[];
}

const TournamentGrid = ({
   tournaments,
   isInteractive = false,
   selectedItems,
}: IProps) => {
   const { socketRef } = useGetSocketContext();
   const queryClient = useQueryClient();
   useEffect(() => {
      if (!socketRef || !socketRef.current) return;
      const socket = socketRef.current;

      socket.on("tournament:edited", () => {
         queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOURNAMENTS] });
      });

      return () => {
         socket.off("tournament:edited");
      };
   }, [socketRef, queryClient]);
   return (
      <>
         {tournaments.map(tournament => {
            const sortedArenas = tournament.arenas.sort(
               (a, b) => a.order - b.order,
            );
            const competitionsByArena = sortedArenas.map(itemComp =>
               tournament.competitions
                  .filter(i => i.arena.id === itemComp.arena.id)
                  .sort((a, b) => a.order - b.order),
            );
            // console.log(competitionsByArena);
            return (
               <div className="mb-12" key={tournament.id}>
                  <h2 className="mb-4 max-sm:text-center">
                     {tournament.title}
                  </h2>
                  <div>
                     {competitionsByArena.reduce(
                        (prev, current) => (prev += current.length),
                        0,
                     ) !== 0 || isInteractive ? (
                        <div
                           className={cn(
                              styles["card-grid"],
                              "max-sm:justify-center",
                           )}
                        >
                           {competitionsByArena.map((competitions, index) => {
                              if (competitions.length !== 0 || isInteractive) {
                                 return (
                                    <TournamentCard
                                       key={sortedArenas[index].id}
                                       tournamentId={tournament.id}
                                       arena={sortedArenas[index]}
                                       competitions={competitions}
                                       isInteractive={isInteractive}
                                       isSelected={selectedItems?.includes(
                                          sortedArenas[index].id,
                                       )}
                                    />
                                 );
                              }
                           })}
                        </div>
                     ) : (
                        <div className="text-black">Нет арен</div>
                     )}
                  </div>
               </div>
            );
         })}
      </>
   );
};

export default TournamentGrid;
