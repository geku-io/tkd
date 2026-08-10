import React from "react";
import { Command, CommandInput } from "../lib-components/command";
import { useQuery } from "@tanstack/react-query";

interface IProps {
   value: string;
   setValue: (val: string) => void;
   placeholder?: string;
}

const TableSearch = ({ value, setValue, placeholder }: IProps) => {
   /* const { data, isPending, isError } = useQuery({
      queryKey: ["test"],
      queryFn: async () => {
         await fetch("https://api.example.com/user");
         return {
            id: "abc-123",
            firstName: "John",
            lastName: "Maverick",
         };
      },
   }); */
   return (
      <div className="flex items-center gap-x-4 sm:h-10 h-9">
         <Command
            shouldFilter={false}
            className="relative overflow-visible h-full"
         >
            <CommandInput
               value={value}
               onValueChange={setValue}
               placeholder={placeholder}
            />
         </Command>
      </div>
   );
};

export default TableSearch;
