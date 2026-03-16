import React from "react";
import TablePagination, { IPaginationProps } from "./TablePagination";

interface IProps extends IPaginationProps {
   rowSelectedCount: number;
   allRowsCount?: number;
}

const TableFooter = ({
   allRowsCount,
   rowSelectedCount,
   ...pagination
}: IProps) => {
   return (
      <>
         {!!allRowsCount && (
            <div className="flex justify-between items-center">
               <div className="text-md">
                  Выбрано {rowSelectedCount} из {allRowsCount}
               </div>
               <div>
                  <TablePagination {...pagination} />
               </div>
            </div>
         )}
      </>
   );
};

export default TableFooter;
