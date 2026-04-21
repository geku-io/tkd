import React, { useCallback, useMemo, useState } from "react";
import { ModalsProvider } from "../../../../contexts/ModalsContext";
import { IModalIds } from "./AdminTournamentGrid";
import { modalOptions, ModalType } from "./tournamentModals.constant";
import { useModalsService } from "./modals.service";
import dynamic from "next/dynamic";
import { ModalsActionProvider } from "../../../../contexts/ModalsActionContext";

const UpdateArenaModal = dynamic(
   () => import("../../modals/arena-modals/UpdateArenaModal"),
   { ssr: false },
);
const CreateCompetitionModal = dynamic(
   () => import("../../modals/competition-modals/CreateCompetitionModal"),
   { ssr: false },
);
const CreateModal = dynamic(() => import("../../modals/CreateModal"), {
   ssr: false,
});
const UpdateCompetitionModal = dynamic(
   () => import("../../modals/competition-modals/UpdateCompetitionModal"),
   { ssr: false },
);
const ConfirmModal = dynamic(() => import("../../modals/ConfirmModal"), {
   ssr: false,
});
const UpdateModal = dynamic(() => import("../../modals/UpdateModal"), {
   ssr: false,
});

interface IProps {
   children: React.ReactNode;
}

const AdminTournamentModals = ({ children }: IProps) => {
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

   const [currentId, setCurrentId] = useState<IModalIds | null>(null);
   const [currentType, setCurrentType] = useState<ModalType | null>(null);

   const {
      deleteTournamentHandler,
      deleteArenaHandler,
      deleteCompetitionHandler,
   } = useModalsService(currentId);

   const searchId =
      currentType === "competition"
         ? currentId?.competitionId
         : currentType === "arena"
           ? currentId?.arenaId
           : currentId?.tournamentId;

   const getDeleteAction = () => {
      if (currentType === "competition") {
         return deleteCompetitionHandler;
      } else if (currentType === "arena") {
         return deleteArenaHandler;
      } else {
         return deleteTournamentHandler;
      }
   };

   const showDeleteHandler = useCallback(() => {
      setIsDeleteModalOpen(true);
   }, []);
   const showUpdateModalHandler = useCallback(() => {
      setIsUpdateModalOpen(true);
   }, []);
   const showCreateHandler = useCallback(() => {
      setIsCreateModalOpen(true);
   }, []);

   const actions = useMemo(
      () => ({
         setCurrentId,
         setCurrentType,
         showDeleteModal: showDeleteHandler,
         showUpdateModal: showUpdateModalHandler,
         showCreateModal: showCreateHandler,
      }),
      [showCreateHandler, showDeleteHandler, showUpdateModalHandler],
   );

   const modalsProps = currentType && modalOptions[currentType];
   return (
      <ModalsProvider<IModalIds | null, ModalType | null>
         value={{
            currentId,
            currentType,
         }}
      >
         <ModalsActionProvider<IModalIds | null, ModalType | null>
            value={actions}
         >
            {isDeleteModalOpen && (
               <ConfirmModal
                  title={modalsProps?.title || modalsProps?.delete?.title}
                  description={
                     modalsProps?.description ||
                     modalsProps?.delete?.description
                  }
                  actionBtnText="Удалить"
                  confirmedAction={getDeleteAction()}
                  isOpen={isDeleteModalOpen}
                  setIsOpen={setIsDeleteModalOpen}
                  btnType="delete"
               />
            )}
            {isUpdateModalOpen &&
               currentType !== "competition" &&
               currentType !== "arena" && (
                  <UpdateModal
                     id={searchId ?? null}
                     isOpen={isUpdateModalOpen}
                     setIsOpen={setIsUpdateModalOpen}
                     source={modalsProps?.update?.source ?? modalsProps?.source}
                     searchSource={
                        modalsProps?.update?.searchSource ??
                        modalsProps?.searchSource
                     }
                     queryKey={
                        modalsProps?.update?.queryKey ?? modalsProps?.queryKey
                     }
                  />
               )}
            {isCreateModalOpen && currentType !== "competition" && (
               <CreateModal
                  isOpen={isCreateModalOpen}
                  setIsOpen={setIsCreateModalOpen}
                  tournamentId={currentId?.tournamentId}
                  isAdding={true}
                  title={modalsProps?.title || modalsProps?.create?.title}
                  description={
                     modalsProps?.description ||
                     modalsProps?.create?.description
                  }
                  source={modalsProps?.create?.source ?? modalsProps?.source}
                  searchSource={
                     modalsProps?.create?.searchSource ??
                     modalsProps?.searchSource
                  }
                  queryKey={
                     modalsProps?.create?.queryKey ?? modalsProps?.queryKey
                  }
               />
            )}

            {isCreateModalOpen && currentType === "competition" && (
               <CreateCompetitionModal
                  isOpen={isCreateModalOpen}
                  setIsOpen={setIsCreateModalOpen}
                  tournamentId={currentId?.tournamentId}
                  arenaId={currentId?.arenaId}
                  queryKey={
                     modalsProps?.create?.queryKey ?? modalsProps?.queryKey
                  }
                  title="Добавление соревнованией"
                  description="Добавьте одну или несколько записей дисциплин"
               />
            )}
            {isUpdateModalOpen && currentType === "competition" && (
               <UpdateCompetitionModal
                  id={searchId ?? null}
                  isOpen={isUpdateModalOpen}
                  setIsOpen={setIsUpdateModalOpen}
                  source={modalsProps?.update?.source ?? modalsProps?.source}
                  queryKey={
                     modalsProps?.update?.queryKey ?? modalsProps?.queryKey
                  }
                  title="Изменение соревнования"
                  description="Измените название дисциплины или категорий у соревнования"
               />
            )}
            {isUpdateModalOpen && currentType === "arena" && (
               <UpdateArenaModal
                  isOpen={isUpdateModalOpen}
                  setIsOpen={setIsUpdateModalOpen}
                  source={modalsProps?.update?.source ?? modalsProps?.source}
                  searchSource={
                     modalsProps?.update?.searchSource ??
                     modalsProps?.searchSource
                  }
                  queryKey={
                     modalsProps?.update?.queryKey ?? modalsProps?.queryKey
                  }
                  title="Изменение названия арены"
                  description="Измените название арены для данного соревнования"
               />
            )}
            {children}
         </ModalsActionProvider>
      </ModalsProvider>
   );
};

export default AdminTournamentModals;
