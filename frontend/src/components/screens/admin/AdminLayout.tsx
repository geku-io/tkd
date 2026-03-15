import React from "react";
import Sidebar from "./Sidebar";
import { verifySession } from "@/lib/verifySession";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
   const user = await verifySession();
   return (
      <div className="h-full w-full flex bg-light-white">
         <Sidebar session={user} />
         <div className="h-full w-full overflow-auto">{children}</div>
      </div>
   );
};

export default AdminLayout;
