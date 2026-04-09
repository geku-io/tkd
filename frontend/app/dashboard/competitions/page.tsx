import React from "react";
import { Metadata } from "next";
import CompetitionsPage from "../../../components/screens/admin/competitions/CompetitionsPage";
import { verifySession } from "../../../lib/verifySession";
import { checkAuth } from "../../../utils/checkAuth";
import { ROUTES, ROUTES_ROLES } from "../../../constants/routes";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
   title: "Соревнования",
};

const Page = async () => {
   const session = await verifySession();
   if (!checkAuth(session.role, ROUTES_ROLES.DISCIPLINES)) {
      redirect(ROUTES.HOME);
   }
   return <CompetitionsPage session={session} />;
};

export default Page;
