import { API } from "../../../../constants/api";
import { QUERY_KEYS } from "../../../../constants/queryKeys";
import { IModalOptions, ModalActionType } from "../../../../types/modals.types";

export type ModalType = "arena" | "tournament" | "competition";

export const modalOptions: Record<
   ModalType,
   Partial<Record<ModalActionType, IModalOptions> & IModalOptions>
> = {
   arena: {
      queryKey: QUERY_KEYS.TOURNAMENTS,
      source: API.ARENAS_IN_TOURNAMENT,
      searchSource: API.ARENAS,
   },
   competition: {
      queryKey: QUERY_KEYS.TOURNAMENTS,
      source: API.COMPETITIONS,
   },
   tournament: {
      queryKey: QUERY_KEYS.TOURNAMENTS,
      source: API.TOURNAMENTS,
      title: "Удаление турнира",
      description: "Запись невозможно будет восстановить. Вы уверены?",
   },
};
