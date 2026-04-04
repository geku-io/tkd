import React from "react";
import { Spinner } from "./lib-components/spinner";

const MainSpinner = () => {
   return (
      <div className="size-full flex items-center justify-center">
         <Spinner className="size-16 text-blue-accent" />
      </div>
   );
};

export default MainSpinner;
