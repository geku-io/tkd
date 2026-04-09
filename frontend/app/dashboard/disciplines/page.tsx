import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifySession } from "../../../lib/verifySession";
import { ROUTES, ROUTES_ROLES } from "../../../constants/routes";
import { checkAuth } from "../../../utils/checkAuth";
import DisciplinesPage from "../../../components/screens/admin/disciplines/DisciplinesPage";

export const metadata: Metadata = {
   title: "Дисциплины",
};

const Page = async () => {
   const session = await verifySession();
   if (!checkAuth(session.role, ROUTES_ROLES.DISCIPLINES)) {
      redirect(ROUTES.HOME);
   }
   return <DisciplinesPage session={session} />;
};

export default Page;
