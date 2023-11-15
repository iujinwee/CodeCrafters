import Header from "@src/components/navbar/header";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Header hideHeader>
      <Stack.Screen name={"success"} />
    </Header>
  );
};

export default StackLayout;
