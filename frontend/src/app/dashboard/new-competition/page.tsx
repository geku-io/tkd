import React from "react";
import { Metadata } from "next";
import NewCompetitionPage from "@/components/screens/admin/new-competition/NewCompetitionPage";
import { verifySession } from "@/lib/verifySession";
import { ROUTES, ROUTES_ROLES } from "@/constants/routes";
import { checkAuth } from "@/utils/checkAuth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
   title: "Новое соревнование",
};

const Page = async () => {
   const session = await verifySession();
   if (!checkAuth(session.role, ROUTES_ROLES.NEW_COMPETITION)) {
      redirect(ROUTES.HOME);
   }
   return <NewCompetitionPage />;
};

export default Page;
