import React from "react";
import { Metadata } from "next";
import UsersPage from "@/components/screens/admin/users/UsersPage";
import { verifySession } from "@/lib/verifySession";
import { checkAuth } from "@/utils/checkAuth";
import { ROUTES, ROUTES_ROLES } from "@/constants/routes";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
   title: "Пользователи",
};

const Page = async () => {
   const session = await verifySession();
   if (!checkAuth(session.role, ROUTES_ROLES.USERS)) {
      redirect(ROUTES.HOME);
   }
   return <UsersPage />;
};

export default Page;
