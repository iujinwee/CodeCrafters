import Header from "@src/components/navbar/header";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Header signOut>
      <Stack.Screen name={"jobs"} />
      <Stack.Screen name={"register"} />
      <Stack.Screen name={"withdrawal"} />
    </Header>
  );
};

export default StackLayout;
