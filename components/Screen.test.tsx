import React from "react";
import { render } from "@testing-library/react-native";
import { Screen } from "./Screen";
import { Text } from "react-native-elements";

test("Screen render correctly", () => {
  const { toJSON } = render(
    <Screen>
      <Text>Test</Text>
    </Screen>
  );

  expect(toJSON()).toMatchSnapshot();
});
