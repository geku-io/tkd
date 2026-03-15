import React from "react";
import { Metadata } from "next";
import CategoriesPage from "@/components/screens/admin/categories/CategoriesPage";
import { verifySession } from "@/lib/verifySession";
import { ROUTES, ROUTES_ROLES } from "@/constants/routes";
import { checkAuth } from "@/utils/checkAuth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
   title: "Категории",
};

const Page = async () => {
   const session = await verifySession();
   if (!checkAuth(session.role, ROUTES_ROLES.CATEGORIES)) {
      redirect(ROUTES.HOME);
   }
   return <CategoriesPage />;
};

export default Page;
