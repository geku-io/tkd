"use client";

import { createContext, useContext, ReactNode, RefObject } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "../hooks/useSocket";

interface SocketContextType {
   socketRef: RefObject<Socket | null>;
   isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
   const { socketRef, isConnected } = useSocket();

   return (
      <SocketContext.Provider value={{ socketRef, isConnected }}>
         {children}
      </SocketContext.Provider>
   );
};

export const useGetSocketContext = () => {
   const context = useContext(SocketContext);
   if (context === undefined) {
      throw new Error("useSocketContext must be used within a SocketProvider");
   }
   return context;
};
