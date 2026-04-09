"use client";
import React, { useState } from "react";
import MainBlock from "../MainBlock";
import AddingButton from "../../../UI/buttons/AddingButton";
import CreateModal from "../../../UI/modals/CreateModal";
import { API } from "../../../../constants/api";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import Table from "../../../UI/table/Table";
import { IAuthUser } from "../../../../types/main.types";

const DisciplinesPage = ({ session }: { session: IAuthUser }) => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <MainBlock
         title="Управление записями дисциплин"
         subTitle="Создание, удаление и редактирование дисциплин"
         actions={<AddingButton action={() => setIsOpen(true)} />}
      >
         <CreateModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            source={API.DISCIPLINES}
            queryKey={QUERY_KEYS.DISCIPLINES}
         />
         <Table
            session={session}
            source={API.DISCIPLINES}
            queryKey={QUERY_KEYS.DISCIPLINES}
         />
      </MainBlock>
   );
};

export default DisciplinesPage;
