import { Text, View, Image } from "react-native";
import BaseButton from "@src/components/utils/button";
import SuccessIcon from "@src/assets/splash/SuccessTickIcon.png";
import React from "react";
import { router } from "expo-router";

const CancellationConfirmationUI = () => {
  const submitHandler = () => {
    // Use replace to reset the route when switching back to scheduled
    router.push("customer/home");
  };
  return (
    <View
      style={{
        alignContent: "center",
        justifyContent: "center",
        flex: true,
        flexDirection: "column",
        display: "flex",
      }}
    >
      <View className={`flex flex-column`} style={{ alignItems: "center" }}>
        <Image source={SuccessIcon} />
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
          Cancelled!
        </Text>
        <Text style={{ fontSize: 15, marginTop: 15, marginBottom: 15 }}>
          We hope to see you again!
        </Text>
        <BaseButton title="OK" onPress={() => submitHandler()} />
      </View>
    </View>
  );
};

export default CancellationConfirmationUI;
