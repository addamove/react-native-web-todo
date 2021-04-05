import { StackNavigationProp } from "@react-navigation/stack";
import { observer } from "mobx-react-lite";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { RootStackParamList } from "../App";
import { AddTodo } from "../components/AddTodo";
import { Screen } from "../components/Screen";
import { Task } from "../components/Task";
import { updateStatus } from "../helpers";
import { useStore } from "../models";

export type ItemsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Items"
>;

type Props = {
  navigation: ItemsScreenNavigationProp;
};

export const Items: React.VFC<Props> = observer(({ navigation }) => {
  const {
    todos,
    fetchTodos,
    addTodo,
    state,
    deleteTodo,
    updateTodo,
  } = useStore();
  React.useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <Screen>
      <AddTodo addTodo={addTodo} />
      {state === "pending" && todos.length === 0 && (
        <View style={{ paddingVertical: 16 }}>
          <ActivityIndicator size={32} color="#794BC4" />
        </View>
      )}
      {todos.map((todo) => (
        <Task
          {...{
            key: todo.id,
            navigation,
            title: todo.title,
            id: todo.id,
            status: todo.status,
            onDeleteItem: () => {
              deleteTodo(todo.id);
            },
            onCheckboxPress: () => {
              updateTodo(todo.id, updateStatus(todo.status));
            },
          }}
        />
      ))}
    </Screen>
  );
});
