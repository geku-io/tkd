import { test, describe, vi, expect } from "vitest";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import TableSearch from "./TableSearch";
import { render, screen } from "@testing-library/react";

const WrapperTableSearch = () => {
   const [value, setValue] = useState("");
   return <TableSearch value={value} setValue={setValue} />;
};

describe("first component test render", () => {
   test("Typing text in input field", async () => {
      const user = userEvent.setup();

      const handleClick = vi.fn();

      render(<TableSearch value="" setValue={handleClick} />);

      const inputEl = screen.getByRole("combobox");

      await user.type(inputEl, "TEST");

      expect(handleClick).toHaveBeenCalled();
   });

   /* test("Testing typing within input field while rendering parent component", async () => {
      const user = userEvent.setup();

      render(<WrapperTableSearch />);

      const controlledInputEl = screen.getByRole("combobox");

      await user.type(controlledInputEl, "TEST v2.0");

      expect(controlledInputEl).toHaveValue("TEST v2.0");
   }); */

   test("responds with the user", async () => {
      const response = await fetch("https://api.example.com/user");
      await expect(response.json()).resolves.toEqual({
         id: "abc-123",
         firstName: "John",
         lastName: "Maverick",
      });
   });
});
