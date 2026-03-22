import React from "react";
import { ISourceAndKey } from "../../../types/main.types";
import TableSearch from "./TableSearch";
import DropDown from "./DropDown";

interface IProps extends ISourceAndKey {
   value: string;
   setValue: (val: string) => void;
   selectedIds?: string[];
   resettingSelection: () => void;
}

const TableActions = ({
   value,
   setValue,
   selectedIds,
   resettingSelection,
   source,
   queryKey,
}: IProps) => {
   return (
      <div className="flex items-center justify-between mb-8 gap-x-4">
         <div className="basis-xs">
            <TableSearch
               value={value}
               setValue={setValue}
               placeholder="Введите название"
            />
         </div>
         <DropDown
            ids={selectedIds}
            source={source}
            queryKey={queryKey}
            resettingSelection={resettingSelection}
         />
      </div>
   );
};

export default TableActions;
