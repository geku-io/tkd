import { useState } from "react";
import userEvent from "@testing-library/user-event";
import TableSearch from "./TableSearch";
import { render, screen } from "test-utils";

const WrapperTableSearch = () => {
   const [value, setValue] = useState("");
   return <TableSearch value={value} setValue={setValue} />;
};

describe("first component test render", () => {
   test("Typing text in input field", async () => {
      const user = userEvent.setup();

      const handleClick = jest.fn();

      render(<TableSearch value="" setValue={handleClick} />);

      const inputEl = screen.getByRole("combobox");

      await user.type(inputEl, "TEST");

      expect(handleClick).toHaveBeenCalled();
   });

   test("Testing typing within input field while rendering parent component", async () => {
      const user = userEvent.setup();

      render(<WrapperTableSearch />);

      const controlledInputEl = screen.getByRole("combobox");

      await user.type(controlledInputEl, "TEST v2.0");

      expect(controlledInputEl).toHaveValue("TEST v2.0");
   });
});
