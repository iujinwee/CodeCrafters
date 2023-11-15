import React from "react";
import QuestionIcon from "@src/assets/splash/QuestionIcon.png";
import BaseButton from "@src/components/utils/button";
import { View, Text, Image } from "react-native";
import { router } from "expo-router";

const SchedulingOptionsUI = () => {
  const routeHandler = (type) => {
    router.push({ pathname: `/customer/schedule/scheduler`, params: { type } });
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
          <Image source={QuestionIcon} />
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
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bold",
              color: "#181C62",
            }}
          >
            What type of Moving Service do you require?
          </Text>
        </View>
        <View
          className={"flex flex-row"}
          style={{ justifyContent: "space-evenly", marginTop: 13 }}
        >
          <BaseButton
            primary
            style={{
              backgroundColor: "#181C62",
              padding: 8,
              paddingLeft: 15,
              paddingRight: 15,
              borderRadius: 7,
            }}
            title="Move In"
            onPress={() => routeHandler("MoveIn")}
          />
          <BaseButton
            style={{
              backgroundColor: "#181C62",
              padding: 8,
              paddingLeft: 15,
              paddingRight: 15,
              borderRadius: 7,
            }}
            title="Move Out"
            onPress={() => routeHandler("MoveOut")}
          />
        </View>
      </View>
    </View>
  );
};

export default SchedulingOptionsUI;
