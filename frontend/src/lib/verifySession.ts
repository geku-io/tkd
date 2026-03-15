import { cookies } from "next/headers";
import { CookieNames, IAuthUser } from "@/types/main.types";
import { API } from "@/constants/api";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { cache } from "react";

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
