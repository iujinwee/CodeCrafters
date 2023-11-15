import Header from "@src/components/navbar/header";
import { Stack } from "expo-router";

const CustomerHomeLayout = () => {
  return (
    <Header signOut>
      <Stack.Screen name={"listings"} />
      <Stack.Screen name={"details"} />
    </Header>
  );
};

export default CustomerHomeLayout;
