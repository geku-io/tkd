import { ISourceAndKey } from "../types/main.types";

export const getQueryKey = ({
   queryKey,
}: Partial<Pick<ISourceAndKey, "queryKey">>) => {
   return typeof queryKey === "string"
      ? [queryKey]
      : typeof queryKey === "object"
      ? [...queryKey]
      : [];
};
