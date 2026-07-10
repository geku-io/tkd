import { fireEvent, render, screen } from "@testing-library/react";
import TableSearch from "./TableSearch";

describe("first component test render", () => {
   test("render TableSearch component", () => {
      const handleClick = jest.fn();
      const { container } = render(
         <TableSearch value="Тест" setValue={handleClick} />,
      );
      // screen.debug();
      console.log(screen.getByRole("combobox"));
      fireEvent.change(screen.getByRole("combobox"), {
         target: {
            value: "Второе значение",
         },
      });
      expect(handleClick).toHaveBeenCalledTimes(1);
   });
});
