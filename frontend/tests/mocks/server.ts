import { setupServer } from "msw/node";
import { handlers } from "./handlers/tournaments";

export const server = setupServer(...handlers);
