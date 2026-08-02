import { Toaster } from "sonner";
import { SocketProvider } from "../providers/SocketProvider";
import { render, RenderOptions } from "@testing-library/react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

const AllProviders = ({ children }: { children: React.ReactNode }) => {
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  retry: false,
               },
            },
         }),
   );
   const spyQueryClient = vi.spyOn(queryClient, "invalidateQueries");
   spyQueryClient.mockImplementation(() => Promise.resolve());
   return (
      <QueryClientProvider client={queryClient}>
         <SocketProvider>
            <Toaster position="top-center" expand={true} richColors={true} />
            {children}
         </SocketProvider>
      </QueryClientProvider>
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
