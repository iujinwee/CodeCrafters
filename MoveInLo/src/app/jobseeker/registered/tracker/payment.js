import { Text, View, Image } from "react-native";
import React from "react";
import SuccessIcon from "@src/assets/splash/SuccessTickIcon.png";
import BaseButton from "@src/components/utils/button";
import { router } from "expo-router";

const PaymentUI = () => {
  const homeHandler = () => {
    router.replace("/");
    router.push("jobseeker/home");
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
          Payment Completed!
        </Text>
        <View className={"w-4/5 mt-4"}>
          <Text
            className={"font-RobotoRegular text-center"}
            style={{
              fontSize: 15,
              textAlign: "center",
            }}
          >
            We look forward to your support in the future!
          </Text>
          <View className={"flex justify-center items-center mt-6"}>
            <BaseButton
              primary
              title={"Back to Home"}
              width={140}
              onPress={() => homeHandler()}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PaymentUI;
