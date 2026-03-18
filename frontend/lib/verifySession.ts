import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { API } from "../constants/api";
import { CookieNames, IAuthUser } from "../types/main.types";
import { ROUTES } from "../constants/routes";

const API_INTERNAL_URL = process.env.API_INTERNAL_URL;
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const verifySession = cache(async (): Promise<IAuthUser> => {
   const cookieStore = await cookies();
   const authCookie = cookieStore.get(CookieNames.AUTH)?.value;
   const refreshCookie = cookieStore.get(CookieNames.REFRESH)?.value;

   if (!authCookie && !refreshCookie) {
      redirect(ROUTES.LOGIN);
   }

   try {
      if (API_INTERNAL_URL && NEXT_PUBLIC_API_URL) {
         const url = API.VALIDATE.replace(
            NEXT_PUBLIC_API_URL,
            API_INTERNAL_URL
         );

         const payload = await fetch(url, {
            headers: {
               "Content-Type": "application/json",
               Cookie: `${CookieNames.AUTH}=${authCookie}; ${CookieNames.REFRESH}=${refreshCookie}`,
            },
         });

         if (!payload.ok) {
            redirect(ROUTES.LOGIN);
         }

         const result: IAuthUser = await payload.json();

         return result;
      } else {
         redirect(ROUTES.BASE);
      }
   } catch {
      redirect(ROUTES.LOGIN);
   }
});
