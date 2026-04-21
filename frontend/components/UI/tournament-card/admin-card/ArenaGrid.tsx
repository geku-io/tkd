import React, { memo } from "react";
import { IStructuredTournaments } from "../changeTournamentData";
import AdminTournamentCard from "./AdminTournamentCard";

interface IProps {
   data: IStructuredTournaments;
   tournamentId: string;
   arenaId: string;
}

const ArenaGrid = memo(function ArenaGrid({
   data,
   tournamentId,
   arenaId,
}: IProps) {
   // console.log("arena grid render");

   return (
      <AdminTournamentCard
         key={arenaId}
         tournamentId={tournamentId}
         arenaId={arenaId}
         arenaEntity={data.arenas.byId[arenaId].arena}
         data={data}
      />
   );
});

export default ArenaGrid;
