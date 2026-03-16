import React from "react";
import MainBlock from "../MainBlock";
import AddingButton from "../../../UI/buttons/AddingButton";
import { API } from "../../../../constants/api";
import Table from "../../../UI/table/Table";
import { QUERY_KEYS } from "../../../../constants/queryKeys";

const CompetitionsPage = () => {
   return (
      <MainBlock
         title="Управление записями соревнований"
         subTitle="Создание, удаление и редактирование соревнований"
         actions={<AddingButton link="/" />}
      >
         <Table source={API.COMPETITIONS} queryKey={QUERY_KEYS.COMPETITIONS} />
      </MainBlock>
   );
};

export default CompetitionsPage;
