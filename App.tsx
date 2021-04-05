import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, rootStore } from "./models";
import { Items } from "./pages/AllItems";
import { Item } from "./pages/Item";

export type RootStackParamList = {
  Items: undefined;
  Item: { id: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ["https://example.com", "example://"],
  config: {
    screens: {
      Items: "items",
      Item: "items/:id",
    },
  },
};

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#794BC4",
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider value={rootStore}>
        <NavigationContainer linking={linking} theme={MyTheme}>
          <Stack.Navigator initialRouteName="Items" headerMode="screen">
            <Stack.Screen
              options={{ animationEnabled: true }}
              name="Items"
              component={Items}
            />
            <Stack.Screen
              options={{ animationEnabled: true }}
              name="Item"
              component={Item}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}
