import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifySession } from "../../../lib/verifySession";
import { ROUTES, ROUTES_ROLES } from "../../../constants/routes";
import { checkAuth } from "../../../utils/checkAuth";
import CategoriesPage from "../../../components/screens/admin/categories/CategoriesPage";

export const metadata: Metadata = {
   title: "Категории",
};

const Page = async () => {
   const session = await verifySession();
   if (!checkAuth(ROUTES_ROLES.CATEGORIES, session.role)) {
      redirect(ROUTES.HOME);
   }
   return <CategoriesPage session={session} />;
};

export default Page;
