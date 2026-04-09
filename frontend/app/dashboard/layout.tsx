import React from "react";
import AdminLayout from "../../components/screens/admin/AdminLayout";
import { UserProvider } from "../../providers/UserProvider";

const layout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="w-full h-full flex flex-col basis-full grow-0 shrink-0">
         <UserProvider>
            <AdminLayout>{children}</AdminLayout>
         </UserProvider>
      </div>
   );
};

export default layout;
