"use client";
import React, { useState } from "react";
import MainBlock from "../MainBlock";
import UsersTable from "./UsersTable";
import CreateUserModal from "./CreateUserModal";
import AddingButton from "../../../UI/buttons/AddingButton";

const UsersPage = () => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <MainBlock
         title="Список авторизованных пользователей"
         actions={<AddingButton action={() => setIsOpen(true)} />}
      >
         <CreateUserModal isOpen={isOpen} setIsOpen={setIsOpen} />
         <UsersTable />
      </MainBlock>
   );
};

export default UsersPage;
