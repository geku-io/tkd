import React from "react";
import MainBlock from "../MainBlock";
import AddingButton from "../../../UI/buttons/AddingButton";
import { API } from "../../../../constants/api";
import Table from "../../../UI/table/Table";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { IAuthUser } from "../../../../types/main.types";

const CompetitionsPage = ({ session }: { session: IAuthUser }) => {
   return (
      <MainBlock
         title="Управление записями соревнований"
         subTitle="Создание, удаление и редактирование соревнований"
         actions={<AddingButton link="/" />}
      >
         <Table
            session={session}
            source={API.COMPETITIONS}
            queryKey={QUERY_KEYS.COMPETITIONS}
         />
      </MainBlock>
   );
};

export default CompetitionsPage;
