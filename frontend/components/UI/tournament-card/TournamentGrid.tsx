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
}

const TournamentGrid = ({ tournaments }: IProps) => {
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
      <div className="max-w-[1440px] px-4 py-10 mx-auto">
         {tournaments.map(tournament => {
            const sortedArenas = tournament.arenas.sort(
               (a, b) => a.order - b.order,
            );
            const competitionsByArena = sortedArenas.map(itemComp =>
               tournament.competitions
                  .filter(i => i.arena.id === itemComp.arena.id)
                  .sort((a, b) => a.order - b.order),
            );
            console.log("sorted: ", competitionsByArena);
            return (
               <div className="mb-12" key={tournament.id}>
                  <h2 className="mb-4 max-sm:text-center">
                     {tournament.title}
                  </h2>
                  <div>
                     {competitionsByArena.length !== 0 ? (
                        <div
                           className={cn(
                              styles["card-grid"],
                              "max-sm:justify-center",
                           )}
                        >
                           {competitionsByArena.map(competitions => {
                              if (competitions.length !== 0) {
                                 return (
                                    <TournamentCard
                                       key={competitions[0].id}
                                       tournamentId={tournament.id}
                                       competitions={competitions}
                                    />
                                 );
                              }
                           })}
                        </div>
                     ) : (
                        <div>Нет арен</div>
                     )}
                  </div>
               </div>
            );
         })}
      </div>
   );
};

export default TournamentGrid;
