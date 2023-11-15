import { Text, View, Image } from "react-native";
import React from "react";
import BaseButton from "@src/components/utils/button";
import SuccessIcon from "@src/assets/splash/SuccessTickIcon.png";
import { router } from "expo-router";

const ScheduleSuccessUI = () => {
  const submitHandler = () => {
    // Use replace to reset the route when switching back to scheduled
    router.push("customer/calendar");
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
      <View className={`flex flex-column`}>
        <View
          className={"flex flex-row"}
          style={{ margin: 10, justifyContent: "center" }}
        >
          <Image source={SuccessIcon} />
        </View>
        <View
          className={"flex flex-row"}
          style={{
            margin: 10,
            justifyContent: "center",
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              textAlign: "center",
              fontWeight: "bold",
              color: "#181C62",
            }}
          >
            Scheduled!
          </Text>
        </View>
        <View
          className={"flex flex-row"}
          style={{
            margin: 10,
            justifyContent: "center",
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <Text style={{ fontSize: 15, textAlign: "center", color: "#000000" }}>
            Our student movers will deliver your items to your designated
            location!
          </Text>
        </View>
        <View
          className={"flex flex-row"}
          style={{ justifyContent: "space-evenly", marginTop: 13 }}
        >
          <BaseButton
            width="50%"
            title="Track Delivery"
            onPress={() => {
              submitHandler();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ScheduleSuccessUI;
