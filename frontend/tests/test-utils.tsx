import { Toaster } from "sonner";
import QueryProvider from "../providers/QueryProvider";
import { SocketProvider } from "../providers/SocketProvider";
import { render, RenderOptions } from "@testing-library/react";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
   return (
      <QueryProvider>
         <SocketProvider>
            <Toaster position="top-center" expand={true} richColors={true} />
            {children}
         </SocketProvider>
      </QueryProvider>
   );
};

const customRender = (
   ui: React.ReactElement,
   options?: Omit<RenderOptions, "wrapper">,
) => {
   return render(ui, { wrapper: AllProviders, ...options });
};

export * from "@testing-library/react";
export { customRender as render };
