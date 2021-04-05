import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { View } from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import { useKeyPress } from "../hooks/useKeyPress";

export const AddTodo = observer(({ addTodo }: { addTodo: Function }) => {
  const todo = useLocalObservable(() => ({
    title: "",
    changeTitle(nv: string) {
      this.title = nv;
    },
  }));

  useKeyPress(
    "Enter",
    () => addTodo({ title: todo.title }) && todo.changeTitle("")
  );

  return (
    <View style={{ flexDirection: "row" }}>
      <Input
        accessibilityLabel="Add ToDo Input"
        value={todo.title}
        containerStyle={{ width: "calc(100% - 200px)" }}
        placeholder="What you should do?"
        onChangeText={(v) => todo.changeTitle(v)}
      />
      <Button
        accessible
        disabled={!todo.title}
        onPress={() => {
          addTodo({ title: todo.title }) && todo.changeTitle("");
        }}
        style={{
          width: "200px",
          paddingLeft: "calc(1rem - 10px)",
          paddingRight: "1rem",
        }}
        buttonStyle={{
          backgroundColor: "#794BC4",
        }}
        icon={
          <Icon
            style={{ marginRight: "0.5rem" }}
            name="plus"
            type="font-awesome"
            color="white"
            size={16}
          />
        }
        title="Add Todo"
      />
    </View>
  );
});
