"use client";
import React, { useState } from "react";
import MainBlock from "../MainBlock";
import UsersTable from "./UsersTable";
import CreateUserModal from "./CreateUserModal";
import AddingButton from "../../../UI/buttons/AddingButton";
import { IAuthUser } from "../../../../types/main.types";

const UsersPage = ({ session }: { session: IAuthUser }) => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <MainBlock
         title="Список авторизованных пользователей"
         actions={<AddingButton action={() => setIsOpen(true)} />}
      >
         <CreateUserModal isOpen={isOpen} setIsOpen={setIsOpen} />
         <UsersTable session={session} />
      </MainBlock>
   );
};

export default UsersPage;
