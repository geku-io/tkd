import { http, HttpResponse } from "msw";
import { API } from "../../../constants/api";
import tournaments from "../data/tournaments.data.json";

export const handlers = [
   http.get(API.TOURNAMENTS, () => {
      return HttpResponse.json(tournaments);
   }),
];
