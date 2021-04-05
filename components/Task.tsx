import { useNavigation } from "@react-navigation/native";
import React from "react";
import { GestureResponderEvent, StyleSheet } from "react-native";
import { Icon, ListItem } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";

export interface ITask {
  id: string;
  title: string;
  description?: string;
  status: "done" | "todo" | "archived";
}
export type ITaskProps = ITask & {
  onCheckboxPress: (event: GestureResponderEvent) => void;
  onDeleteItem: (id: string) => void;
};

export const Task: React.VFC<ITaskProps> = ({
  status,
  title,
  onDeleteItem,
  onCheckboxPress,
  id,
}) => {
  const navigation = useNavigation();

  return (
    <ListItem containerStyle={styles.container} bottomDivider>
      <ListItem.CheckBox
        checkedColor="#794BC4"
        checked={status === "done"}
        onPress={onCheckboxPress}
      />
      <ListItem.Content>
        <ListItem.Title>{title}</ListItem.Title>
      </ListItem.Content>
      <TouchableOpacity
        accessible
        accessibilityRole="button"
        testID="delete-button"
        accessibilityLabel="Delete Item"
        onPress={() => onDeleteItem(id)}
      >
        <Icon
          style={{ marginRight: "0.5rem" }}
          name="trash"
          type="font-awesome"
          color="red"
          size={24}
        />
      </TouchableOpacity>
      <ListItem.Chevron
        testID="navigator"
        onPress={() => navigation.navigate("Item", { id })}
        size={24}
      />
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  divider: {
    width: 1,
  },
});
