import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifySession } from "../../../lib/verifySession";
import { ROUTES, ROUTES_ROLES } from "../../../constants/routes";
import { checkAuth } from "../../../utils/checkAuth";
import UsersPage from "../../../components/screens/admin/users/UsersPage";

export const metadata: Metadata = {
   title: "Пользователи",
};

const Page = async () => {
   const session = await verifySession();
   if (!checkAuth(session.role, ROUTES_ROLES.USERS)) {
      redirect(ROUTES.HOME);
   }
   return <UsersPage session={session} />;
};

export default Page;
