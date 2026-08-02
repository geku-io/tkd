import { screen, waitFor, within } from "@testing-library/react";
import { expect, test } from "vitest";
import HomePage from "../../../screens/admin/home/HomePage";
import { SESSIONS } from "../../../../tests/mocks/data/session.data";
import { render } from "../../../../tests/test-utils";
import { server } from "../../../../tests/mocks/server";
import { http, HttpResponse } from "msw";
import { API } from "../../../../constants/api";
import { IBaseEntityWithTitleAndCount } from "../../../../types/main.types";
import { ITournament } from "../../../../types/entities.types";
import userEvent from "@testing-library/user-event";
import tournaments from "../../../../tests/mocks/data/tournaments.data.json";
import { IUpdateCompetitionStatusBody } from "../../../../types/query.types";

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

const checkClickStatusBtn = (tournament_id: string, id: string) => {
   const requestState: {
      updateBody?: Pick<IUpdateCompetitionStatusBody, "isFinished" | "isLive">;
   } = {};

   const competition = tournaments.data
      .find(item => item.id === tournament_id)
      ?.competitions.find(item => item.id === id);

   expect(competition).not.toBeUndefined();

   server.use(
      http.patch<
         never,
         Pick<IUpdateCompetitionStatusBody, "isFinished" | "isLive">
      >(`${API.COMPETITIONS}/:id`, async ({ request }) => {
         requestState.updateBody = await request.json();
         return HttpResponse.json({});
      }),
   );

   render(<HomePage session={SESSIONS.ADMIN} />);

   return { requestState, competition };
};

test("Click isFinished button", async () => {
   const user = userEvent.setup();

   const tournament_id = "179b9ed2-7776-4107-9793-9cce2fe81290";
   const id = "427af194-cf6d-49dd-9f58-be0f62a96b7b";

   const { competition, requestState } = checkClickStatusBtn(tournament_id, id);

   const cardItem = await screen.findByTestId(id);

   const checkbox = within(cardItem).getByRole("checkbox");

   await user.click(checkbox);

   if (competition!.isFinished) {
      expect(checkbox).not.toBeChecked();
   } else {
      expect(checkbox).toBeChecked();
   }

   await waitFor(() =>
      expect(requestState.updateBody).toEqual({
         isFinished: !competition?.isFinished,
      }),
   );
});

test("Click isFinished button on living competition", async () => {
   const user = userEvent.setup();

   const tournament_id = "179b9ed2-7776-4107-9793-9cce2fe81290";
   const id = "8569bc7f-75b8-4c3a-8753-03a198b88ee6";

   const { requestState } = checkClickStatusBtn(tournament_id, id);

   const cardItem = await screen.findByTestId(id);

   const checkbox = within(cardItem).getByRole("checkbox");
   const btn = within(cardItem).getByRole("button", { name: "Live button" });

   expect(checkbox).not.toBeChecked();

   expect(btn).toHaveClass("text-red-accent");

   await user.click(checkbox);

   expect(checkbox).toBeChecked();

   expect(btn).not.toHaveClass("text-red-accent");

   await waitFor(() =>
      expect(requestState.updateBody).toEqual({
         isFinished: true,
         isLive: false,
      }),
   );
});

test("Click isLive button", async () => {
   const user = userEvent.setup();

   const tournament_id = "179b9ed2-7776-4107-9793-9cce2fe81290";
   const id = "8569bc7f-75b8-4c3a-8753-03a198b88ee6";

   const { competition, requestState } = checkClickStatusBtn(tournament_id, id);

   const cardItem = await screen.findByTestId(id);

   const btn = within(cardItem).getByRole("button", { name: "Live button" });

   await user.click(btn);

   if (competition!.isLive) {
      expect(btn).not.toHaveClass("text-red-accent");
   } else {
      expect(btn).toHaveClass("text-red-accent");
   }

   await waitFor(() =>
      expect(requestState.updateBody).toEqual({
         isLive: !competition?.isLive,
      }),
   );
});

test("Click isLive button on finished competition", async () => {
   const user = userEvent.setup();

   const tournament_id = "179b9ed2-7776-4107-9793-9cce2fe81290";
   const id = "e2f8ba43-fc78-4a4f-9613-c0dc23d229b4";

   const { requestState } = checkClickStatusBtn(tournament_id, id);

   const cardItem = await screen.findByTestId(id);

   const checkbox = within(cardItem).getByRole("checkbox");
   const btn = within(cardItem).getByRole("button", { name: "Live button" });

   expect(checkbox).toBeChecked();

   expect(btn).not.toHaveClass("text-red-accent");

   await user.click(btn);

   expect(checkbox).not.toBeChecked();

   expect(btn).toHaveClass("text-red-accent");

   await waitFor(() =>
      expect(requestState.updateBody).toEqual({
         isFinished: false,
         isLive: true,
      }),
   );
});
