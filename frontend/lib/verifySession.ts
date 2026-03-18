import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { API } from "../constants/api";
import { CookieNames, IAuthUser } from "../types/main.types";
import { ROUTES } from "../constants/routes";

export const verifySession = cache(async (): Promise<IAuthUser> => {
   const cookieStore = await cookies();
   const authCookie = cookieStore.get(CookieNames.AUTH)?.value;
   const refreshCookie = cookieStore.get(CookieNames.REFRESH)?.value;

   try {
      const payload = await fetch(API.VALIDATE, {
         headers: {
            "Content-Type": "application/json",
            Cookie: `${CookieNames.AUTH}=${authCookie}; ${CookieNames.REFRESH}=${refreshCookie}`,
         },
      });

      const result: IAuthUser = await payload.json();

      return result;
   } catch {
      redirect(ROUTES.LOGIN);
   }
});
