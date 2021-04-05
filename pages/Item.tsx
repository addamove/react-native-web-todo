import React, { useEffect, useState } from "react";
import { Card, CheckBox, Input } from "react-native-elements";
import { StyleSheet } from "react-native";
import { Screen } from "../components/Screen";
import { RouteProp, useRoute } from "@react-navigation/core";
import { RootStackParamList } from "../App";
import { ITask, useStore } from "../models";
import { observer } from "mobx-react-lite";
import { updateStatus } from "../helpers";
import { useDebouncedCallback } from "use-debounce/lib";
import useUpdateEffect from "../hooks/useUpdateEffect";
import { usePrevious } from "../hooks/usePrev";

export type ItemScreenNavigationProp = RouteProp<RootStackParamList, "Item">;

export const Item: React.VFC<{}> = observer(() => {
  const {
    params: { id },
  } = useRoute<ItemScreenNavigationProp>();
  const [item, setItem] = useState<Partial<ITask>>({});
  const updateDescription = useDebouncedCallback(
    () => updateTodo(id, { description: item.description }),
    1000
  );

  const { getTodo, updateTodo, state } = useStore();
  const { title, description, status, changeDescription } = item;

  const prevItem = usePrevious<ITask>(item);

  // download item
  useEffect(() => {
    getTodo(id).then((item) => setItem(item || {}));
  }, [id, state]);

  // update description
  useUpdateEffect(() => {
    if (prevItem !== undefined && prevItem.description !== undefined) {
      updateDescription();
    }
  }, [item.description]);

  const isChecked = status === "done";

  return (
    <Screen>
      <Card>
        <Card.Title style={styles.title}>
          <CheckBox
            onPress={() => status && updateTodo(id, updateStatus(status))}
            checkedColor="#794BC4"
            containerStyle={styles.container}
            checked={isChecked}
          />
          {title}
        </Card.Title>
        <Card.Divider />
        <Input
          onChangeText={(v) => changeDescription && changeDescription(v)}
          style={styles.description}
          value={description}
          multiline={true}
          numberOfLines={10}
        />
      </Card>
    </Screen>
  );
});

const styles = StyleSheet.create({
  title: { textAlign: "left" },
  description: { marginBottom: 10, fontSize: 16 },
  container: { marginLeft: 0, marginRight: 0, margin: 0 },
});
