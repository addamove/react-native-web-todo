import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { ITaskProps, Task } from "./Task";

const navigateJestMockFn = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useFocusEffect: () => jest.fn(),
    useNavigation: () => ({
      navigate: navigateJestMockFn,
    }),
  };
});

describe("Task tests", () => {
  const taskProps: ITaskProps = {
    onDeleteItem: jest.fn(),
    onCheckboxPress: jest.fn(),
    description: "description",
    id: "123",
    status: "todo",
    title: "title",
  };

  it("Toggle status", () => {
    const { getByTestId } = render(<Task {...taskProps} />);
    const checkbox = getByTestId("checkbox");
    fireEvent.press(checkbox);
    fireEvent.press(checkbox);
    expect(taskProps.onCheckboxPress).toBeCalledTimes(2);
  });
  it("Fire Deliting", () => {
    const { getAllByA11yLabel, getByTestId, toJSON, debug } = render(
      <Task {...taskProps} />
    );
    const deleteButton = getByTestId("delete-button");
    fireEvent.press(deleteButton);
    expect(taskProps.onDeleteItem).toBeCalledTimes(1);
  });
  it("Fire navigate", () => {
    const { getByTestId } = render(<Task {...taskProps} />);
    const navigateButton = getByTestId("navigator");
    fireEvent.press(navigateButton);
    expect(navigateJestMockFn).toBeCalledTimes(1);
  });

  it("Should render snapshot", () => {
    const { toJSON } = render(<Task {...taskProps} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
