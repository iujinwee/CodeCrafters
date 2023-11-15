import React from "react";
import { Stack } from "expo-router";
import Header from "@src/components/navbar/header";

export default function AuthLayout() {
  return (
    <Header>
      <Stack.Screen name={"login"} />
      <Stack.Screen name={"signup"} />
      <Stack.Screen name={"forgetpassword"} />
      <Stack.Screen name={"pdpa"} />
    </Header>
  );
}
