import { useRef, useCallback } from "react";

export function useThrottle<T>(
   callback: (args: T) => void,
   delay: number = 50,
) {
   const lastCallRef = useRef(0);

   return useCallback(
      (args: T) => {
         const now = Date.now();
         const timeSinceLastCall = now - lastCallRef.current;

         if (timeSinceLastCall >= delay) {
            lastCallRef.current = now;
            callback(args);
         }
      },
      [callback, delay],
   );
}
