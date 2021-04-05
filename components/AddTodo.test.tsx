import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AddTodo } from "./AddTodo";

test("Should sumbit new Todo ITem", () => {
  const addTodo = jest.fn();
  const TEST_TITLE = "TEST";

  const { getByA11yLabel, getByText } = render(<AddTodo addTodo={addTodo} />);

  const button = getByText("Add Todo");
  const input = getByA11yLabel("Add ToDo Input");

  fireEvent.changeText(input, TEST_TITLE);
  fireEvent.press(button);

  expect(addTodo).toBeCalledWith({ title: TEST_TITLE });
});
