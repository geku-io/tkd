import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { render } from "../../../../tests/test-utils";
import HomePage from "../../../screens/admin/home/HomePage";
import { SESSIONS } from "../../../../tests/mocks/data/session.data";
import { server } from "../../../../tests/mocks/server";
import { http, HttpResponse } from "msw";
import { API } from "../../../../constants/api";
import { IBaseEntityWithTitleAndCount } from "../../../../types/main.types";
import { ITournament } from "../../../../types/entities.types";

test("Check component behavior while tournaments data is exist", async () => {
   render(<HomePage session={SESSIONS.ADMIN} />);
   expect(
      screen.getByLabelText("Loading", { selector: "svg" }),
   ).toBeInTheDocument();

   expect(await screen.findByText("Список соревнований")).toBeInTheDocument();
});

test("Check component behavior while tournaments data is not exist", async () => {
   server.use(
      http.get(API.TOURNAMENTS, () => {
         return HttpResponse.json<IBaseEntityWithTitleAndCount<ITournament>>({
            count: 0,
            data: [],
         });
      }),
   );

   render(<HomePage session={SESSIONS.ADMIN} />);

   expect(await screen.findByText("Записей не найдено")).toBeInTheDocument();
});

test("Check component behavior while error", async () => {
   server.use(
      http.get(API.TOURNAMENTS, () => {
         return HttpResponse.json(null, {
            status: 500,
         });
      }),
   );

   render(<HomePage session={SESSIONS.ADMIN} />);

   expect(
      await screen.findByText("Ошибка получения данных"),
   ).toBeInTheDocument();
});

test("Drag and drop competition", async () => {
   render(<HomePage session={SESSIONS.ADMIN} />);

   // const competitions = ;
});
