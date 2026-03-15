import { CompetitionType } from "./new-competition.schema";
import { v4 as uuidv4 } from "uuid";

export const defaultCompetition: CompetitionType = {
   tournamentTitle: "",
   arenas: [
      {
         id: uuidv4(),
         arenaTitle: "",
         info: [
            {
               id: uuidv4(),
               discipline: "",
               categories: [],
            },
         ],
      },
   ],
};
