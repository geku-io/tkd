import { Roboto } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import QueryProvider from "../providers/QueryProvider";

export const metadata: Metadata = {
   title: "Расписание соревнование ТКД по тхэквондо",
   description: "Расписание соревнование ТКД по тхэквондо",
};

const roboto = Roboto({
   subsets: ["cyrillic"],
});

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="ru" suppressHydrationWarning>
         <body className={roboto.className}>
            <QueryProvider>
               <Toaster position="top-center" expand={true} richColors={true} />
               {children}
            </QueryProvider>
         </body>
      </html>
   );
}
