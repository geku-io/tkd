import LoginPage from "@/components/screens/login/LoginPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
   title: "Вход в систему",
};

const Page = () => {
   return <LoginPage />;
};

export default Page;
