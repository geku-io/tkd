import { API } from "../constants/api";

let refreshPromise: Promise<unknown> | null = null;

export const fetchApi = async <T = unknown>(
   url: string,
   options: RequestInit = {}
): Promise<T> => {
   const requestOptions: RequestInit = {
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
      },
      ...options,
   };
   try {
      const res = await fetch(url, requestOptions);

      if (!res.ok) {
         if (res.status === 401 && url !== API.REFRESH) {
            if (!refreshPromise) {
               refreshPromise = fetchApi(API.REFRESH, {
                  ...requestOptions,
                  method: "POST",
               }).catch(error => {
                  refreshPromise = null;
                  throw error;
               });
            }
            try {
               await refreshPromise;
            } finally {
               refreshPromise = null;
            }
            return await fetchApi<T>(url, options);
         }
         throw new Error(`${res.status} ${res.statusText}`);
      }

      return res.json();
   } catch (error) {
      if (error instanceof Error) {
         throw error;
      }
      throw new Error("Unknown error occurred");
   }
};
