import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IBaseEntityWithTitle, ISourceAndKey } from "../types/main.types";
import {
   IArenaInfo,
   ICreateEntities,
   IDeleteMany,
   IIdWithBody,
   IUpdateEntity,
} from "../types/query.types";
import { fetchApi } from "../lib/fetchApi";
import { getQueryKey } from "../utils/getQueryKey";

interface IMutationProps extends Partial<ISourceAndKey> {
   onSettledHandler?: () => void;
}

interface IDeleteProps extends ISourceAndKey {
   onSettledHandler?: () => void;
}

interface IEntityWithId extends IMutationProps {
   id: string | null;
}

interface IEnabledEntityWithId extends IEntityWithId {
   enabled: boolean;
}

export const useCreateEntities = <T = ICreateEntities>({
   onSettledHandler,
   queryKey,
   source,
}: IMutationProps) => {
   const queryClient = useQueryClient();
   const mutation = useMutation({
      mutationFn: async (body: T) => {
         if (!source) {
            throw new Error("Отсутствует эндпоинт");
         }
         const res = await fetchApi(source, {
            method: "POST",
            body: JSON.stringify(body),
         });

         return res;
      },

      onSuccess: () => {
         toast.success("Записи успешно созданы");
         const queryKeyArr = getQueryKey({ queryKey });
         queryKeyArr.forEach(item => {
            queryClient.invalidateQueries({
               queryKey: [item],
            });
         });
      },

      onError: () => {
         toast.error("Ошибка при создании");
      },

      onSettled: () => {
         if (onSettledHandler) onSettledHandler();
      },
   });
   return mutation;
};

export const useDeleteEntity = ({
   queryKey,
   source,
   onSettledHandler,
}: IDeleteProps) => {
   const queryClient = useQueryClient();
   const mutation = useMutation({
      mutationFn: async ({ id, body }: IIdWithBody<IArenaInfo>) => {
         const res = await fetchApi(`${source}/${id}`, {
            method: "DELETE",
            body: JSON.stringify(body),
         });

         return res;
      },

      onSuccess: () => {
         toast.success("Запись успешно удалена");
         const queryKeyArr = getQueryKey({ queryKey });
         queryKeyArr.forEach(item => {
            queryClient.invalidateQueries({
               queryKey: [item],
            });
         });
      },

      onError: () => {
         toast.error("Ошибка при удалении");
      },

      onSettled: () => {
         if (onSettledHandler) onSettledHandler();
      },
   });
   return mutation;
};

export const useDeleteEntities = <T>({
   queryKey,
   source,
   onSettledHandler,
}: IDeleteProps) => {
   const queryClient = useQueryClient();
   const deleteEntities = useMutation({
      mutationFn: async (body: IDeleteMany<T>) => {
         const res = await fetchApi(source, {
            method: "DELETE",
            body: JSON.stringify(body),
         });

         return res;
      },

      onSuccess: () => {
         toast.success("Записи успешно удалены");
         const queryKeyArr = getQueryKey({ queryKey });
         queryKeyArr.forEach(item => {
            queryClient.invalidateQueries({
               queryKey: [item],
            });
         });
      },

      onError: () => {
         toast.error("Ошибка при удалении");
      },

      onSettled: () => {
         if (onSettledHandler) onSettledHandler();
      },
   });
   return deleteEntities;
};

export const useGetEntity = <T = IBaseEntityWithTitle>({
   queryKey,
   source,
   id,
   enabled,
}: IEnabledEntityWithId) => {
   const query = useQuery<T>({
      queryKey: [...getQueryKey({ queryKey }), id],
      queryFn: async () => {
         const result = await fetchApi<T>(`${source}/${id}`);
         return result;
      },
      enabled: !!enabled && !!id && !!source && !!queryKey,
   });
   return query;
};

export const useUpdateEntity = <T = IUpdateEntity>({
   onSettledHandler,
   queryKey,
   source,
   id,
}: IEntityWithId) => {
   const queryClient = useQueryClient();
   const mutation = useMutation({
      mutationFn: async (body: T) => {
         if (!source) {
            throw new Error("Некоректный путь");
         }
         const res = await fetchApi(`${source}/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
         });

         return res;
      },

      onSuccess: () => {
         toast.success("Запись успешно обновлена");
         const queryKeyArr = getQueryKey({ queryKey });
         queryKeyArr.forEach(item => {
            queryClient.invalidateQueries({
               queryKey: [item],
            });
         });
      },

      onError: () => {
         toast.error("Ошибка при обновлении");
      },

      onSettled: () => {
         if (onSettledHandler) onSettledHandler();
      },
   });
   return mutation;
};

export const useUpdateMiddleEntity = <T = IUpdateEntity>({
   onSettledHandler,
   queryKey,
   source,
}: IMutationProps) => {
   const queryClient = useQueryClient();
   const mutation = useMutation({
      mutationFn: async (body: T) => {
         if (!source) {
            throw new Error("Некоректный путь");
         }
         const res = await fetchApi(source, {
            method: "PATCH",
            body: JSON.stringify(body),
         });

         return res;
      },

      onSuccess: () => {
         toast.success("Запись успешно обновлена");
         const queryKeyArr = getQueryKey({ queryKey });
         queryKeyArr.forEach(item => {
            queryClient.invalidateQueries({
               queryKey: [item],
            });
         });
      },

      onError: () => {
         toast.error("Ошибка при обновлении");
      },

      onSettled: () => {
         if (onSettledHandler) onSettledHandler();
      },
   });
   return mutation;
};
/* export const useCreateCompetition = ({ queryKey }: Partial<ISourceAndKey>) => {
   const mutation = useMutation({
      mutationFn: async (body: ICreateCompetitionBody) => {
         const res = await fetchApi(API.COMPETITIONS, {
            method: "POST",
            body: JSON.stringify(body),
         });

         return res;
      },

      onSuccess: () => {
         toast.success("Соревнования успешно созданы");
         if (queryKey) {
            queryClient.invalidateQueries({
               queryKey: [queryKey],
            });
         }
      },

      onError: () => {
         toast.error("Ошибка при создании");
      },
   });
   return mutation;
}; */
