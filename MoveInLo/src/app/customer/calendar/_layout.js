import Header from "@src/components/navbar/header";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Header signOut>
      <Stack.Screen name={"agenda"} />
      <Stack.Screen name={"progress"} />
      <Stack.Screen name={"payment"} />
      <Stack.Screen name={"cancel"} />
    </Header>
  );
};

export default StackLayout;
