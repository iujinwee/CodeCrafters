import Header from "@src/components/navbar/header";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Header hideHeader>
      <Stack.Screen name={"payment_QR"} />
    </Header>
  );
};

export default StackLayout;
