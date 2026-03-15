import { fetchApi } from "@/lib/fetchApi";
import { queryClient } from "@/providers/QueryProvider";
import { IBaseEntityWithTitle, ISourceAndKey } from "@/types/main.types";
import {
   IArenaInfo,
   ICreateEntities,
   IDeleteMany,
   IIdWithBody,
   IUpdateEntity,
} from "@/types/query.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface IEntityWithId extends Partial<ISourceAndKey> {
   id: string | null;
}

interface IEnabledEntityWithId extends IEntityWithId {
   enabled: boolean;
}

export const useCreateEntities = <T = ICreateEntities>({
   queryKey,
   source,
}: Partial<ISourceAndKey>) => {
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
         queryClient.invalidateQueries({
            queryKey: [queryKey],
         });
      },

      onError: () => {
         toast.error("Ошибка при создании");
      },
   });
   return mutation;
};

export const useDeleteEntity = ({ queryKey, source }: ISourceAndKey) => {
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
         queryClient.invalidateQueries({
            queryKey: [queryKey],
         });
      },

      onError: () => {
         toast.error("Ошибка при удалении");
      },
   });
   return mutation;
};

export const useDeleteEntities = <T>({ queryKey, source }: ISourceAndKey) => {
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
         queryClient.invalidateQueries({
            queryKey: [queryKey],
         });
      },

      onError: () => {
         toast.error("Ошибка при удалении");
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
      queryKey: [queryKey, id],
      queryFn: async () => {
         const result = await fetchApi<T>(`${source}/${id}`);
         return result;
      },
      enabled: !!enabled && !!id && !!source && !!queryKey,
   });
   return query;
};

export const useUpdateEntity = <T = IUpdateEntity>({
   queryKey,
   source,
   id,
}: IEntityWithId) => {
   const mutation = useMutation({
      mutationFn: async (body: T) => {
         const res = await fetchApi(`${source}/${id}`, {
            method: "PATCH",
            body: JSON.stringify(body),
         });

         return res;
      },

      onSuccess: () => {
         toast.success("Запись успешно обновлена");
         queryClient.invalidateQueries({
            queryKey: [queryKey],
         });
      },

      onError: () => {
         toast.error("Ошибка при обновлении");
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
