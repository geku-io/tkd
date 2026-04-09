"use client";
import React, { useState } from "react";
import MainBlock from "../MainBlock";
import AddingButton from "../../../UI/buttons/AddingButton";
import CreateModal from "../../../UI/modals/CreateModal";
import { API } from "../../../../constants/api";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import Table from "../../../UI/table/Table";
import { IAuthUser } from "../../../../types/main.types";

const CategoriesPage = ({ session }: { session: IAuthUser }) => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <MainBlock
         title="Управление записями категорий"
         subTitle="Создание, удаление и редактирование категорий"
         actions={<AddingButton action={() => setIsOpen(true)} />}
      >
         <CreateModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            source={API.CATEGORIES}
            queryKey={QUERY_KEYS.CATEGORIES}
         />
         <Table
            session={session}
            source={API.CATEGORIES}
            queryKey={QUERY_KEYS.CATEGORIES}
         />
      </MainBlock>
   );
};

export default CategoriesPage;
