import { Metadata } from "next";
import React from "react";
import LoginPage from "../../components/screens/login/LoginPage";

export const metadata: Metadata = {
   title: "Вход в систему",
};

const Page = () => {
   return <LoginPage />;
};

export default Page;
