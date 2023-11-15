import Header from "@src/components/navbar/header";
import React from "react";
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <Header>
      <Stack.Screen name={"options"} />
      <Stack.Screen name={"scheduler"} />
      <Stack.Screen name={"schedulesuccess"} />
    </Header>
  );
}
