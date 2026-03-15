import React from "react";
import { IStructuredTournaments } from "../changeTournamentData";
import styles from "../Tournament.module.css";
import AdminTournamentCard from "./AdminTournamentCard";
import { useGetModalsContext } from "@/contexts/ModalsContext";
import TournamentOptions from "../TournamentOptions";
import { ModalType } from "./tournamentModals.constant";
import { IModalIds } from "./AdminTournamentGrid";

interface IProps {
   data: IStructuredTournaments;
}

const AdminTournamentGridContent = ({ data }: IProps) => {
   const {
      setCurrentId,
      setCurrentType,
      showDeleteModal,
      showUpdateModal,
      showCreateModal,
   } = useGetModalsContext<IModalIds | null, ModalType | null>();

   return (
      <div>
         {data.tournaments.allIds.map(tournamentId => {
            const currentTournament = data.tournaments.byId[tournamentId];
            const arenas = data.orderByArena[tournamentId];
            const arenaIds = Object.keys(arenas);
            const showTournamentDeleteModal = () => {
               if (showDeleteModal && setCurrentId && setCurrentType) {
                  setCurrentId({ tournamentId });
                  setCurrentType("tournament");
                  showDeleteModal();
               }
            };
            const showTournamentUpdateModal = () => {
               if (showUpdateModal && setCurrentId && setCurrentType) {
                  setCurrentId({ tournamentId });
                  setCurrentType("tournament");
                  showUpdateModal();
               }
            };
            const showTournamentCreateModal = () => {
               if (showCreateModal && setCurrentId && setCurrentType) {
                  setCurrentId({ tournamentId });
                  setCurrentType("arena");
                  showCreateModal();
               }
            };
            return (
               <div className="mb-12" key={tournamentId}>
                  <div className="flex gap-x-2 items-center mb-4">
                     <h2>{currentTournament.title}</h2>
                     <TournamentOptions
                        showDelete={showTournamentDeleteModal}
                        showUpdate={showTournamentUpdateModal}
                        showCreate={showTournamentCreateModal}
                     />
                  </div>
                  <div>
                     {arenaIds.length !== 0 ? (
                        <div className={styles["card-grid"]}>
                           {arenaIds.map(arenaId => {
                              const competitionIdsByArena =
                                 data.orderByArena[tournamentId][arenaId];
                              const competitionsByArena =
                                 competitionIdsByArena.map(
                                    comp => data.competitions.byId[comp]
                                 );
                              return (
                                 <AdminTournamentCard
                                    key={arenaId}
                                    tournamentId={tournamentId}
                                    competitions={competitionsByArena}
                                    competitionsList={competitionIdsByArena}
                                    arenaId={arenaId}
                                    arenaEntity={
                                       data.arenas.byId[arenaId].arena
                                    }
                                 />
                              );
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

export default AdminTournamentGridContent;
