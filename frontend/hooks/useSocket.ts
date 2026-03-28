import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
   const [isConnected, setIsConnected] = useState(false);
   const socketRef = useRef<Socket | null>(null);

   useEffect(() => {
      const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL, {
         withCredentials: true,
         reconnection: true,
         reconnectionAttempts: 10,
         reconnectionDelay: 1000,
         reconnectionDelayMax: 5000,
         timeout: 20000,
         autoConnect: true,
         transports: ["websocket", "polling"],
      });

      socketRef.current = socketInstance;

      const onConnect = () => {
         console.log("Connected to WebSocket");
         setIsConnected(true);
      };

      const onDisconnect = (reason: string) => {
         console.log("Disconnected from WebSocket:", reason);
         setIsConnected(false);
      };

      const onConnectError = (error: Error) => {
         console.error("Connection error:", error);
      };

      const onReconnect = (attemptNumber: number) => {
         console.log("Reconnected after", attemptNumber, "attempts");
      };

      const onReconnectError = (error: Error) => {
         console.error("Reconnection error:", error);
      };

      socketInstance.on("connect", onConnect);
      socketInstance.on("disconnect", onDisconnect);
      socketInstance.on("connect_error", onConnectError);
      socketInstance.on("reconnect", onReconnect);
      socketInstance.on("reconnect_error", onReconnectError);

      return () => {
         socketInstance.off("connect", onConnect);
         socketInstance.off("disconnect", onDisconnect);
         socketInstance.off("connect_error", onConnectError);
         socketInstance.off("reconnect", onReconnect);
         socketInstance.off("reconnect_error", onReconnectError);
         socketInstance.disconnect();
         socketRef.current = null;
         setIsConnected(false);
      };
   }, []);

   return { socketRef: socketRef, isConnected };
};
