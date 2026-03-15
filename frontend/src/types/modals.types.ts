import { ISourceAndKey, SetStateType } from "./main.types";

export interface IModalProps extends Partial<ISourceAndKey> {
   isOpen: boolean;
   setIsOpen: SetStateType<boolean>;
   searchSource?: string;
}

interface IModalContent {
   title: string;
   description: string;
   actionBtnText: string;
   cancelBtnText?: string;
}

export type ModalActionType = "create" | "update" | "delete";

export interface IModalOptions
   extends ISourceAndKey,
      Partial<IModalContent>,
      Pick<IModalProps, "searchSource"> {}

export interface IModalOptionalContent
   extends IModalProps,
      Partial<IModalContent> {}
