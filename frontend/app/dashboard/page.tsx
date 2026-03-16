import { Metadata } from "next";
import HomePage from "../../components/screens/admin/home/HomePage";
import { verifySession } from "../../lib/verifySession";

export const metadata: Metadata = {
   title: "Админ панель",
};

const Page = async () => {
   const session = await verifySession();
   return <HomePage session={session} />;
};

export default Page;
