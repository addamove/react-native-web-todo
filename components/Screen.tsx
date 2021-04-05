import React from "react";
import { View, StyleSheet } from "react-native";

export const Screen: React.FunctionComponent<{}> = ({ children }) => {
  return <View style={styles.content}>{children}</View>;
};

const styles = StyleSheet.create({
  content: {
    padding: "0.5rem",
  },
});
