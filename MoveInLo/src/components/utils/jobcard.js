import { Image, Text, View } from "react-native";
import React from "react";
import BaseButton from "@src/components/utils/button";
import { router } from "expo-router";

const BaseJobCard = ({ title, description, source, listingInfo }) => {
  const size = 75;

  const registerHandler = () => {
    router.push({
      pathname: "/jobseeker/joblistings/details",
      params: listingInfo,
    });
  };

  return (
    <View className={"flex flex-row mx-5 my-3 border-b-[1px] border-gray"}>
      <View className={"items-center justify-center mx-3"}>
        <Image
          source={source}
          style={{ height: size, width: size, borderRadius: 20 }}
        />
      </View>
      <View className={"flex flex-col ml-4 w-4/6"}>
        <View>
          <Text className={"font-RobotoBold"}>{title}</Text>
        </View>

        <View className={"mt-2"} style={{ flexDirection: "row" }}>
          <Text
            className={"font-RobotoLight"}
            style={{ flex: 1, flexWrap: "wrap" }}
          >
            {description}
          </Text>
        </View>

        <View className={"flex flex-row justify-center my-4"}>
          <BaseButton
            primary
            title={"Register Job"}
            onPress={() => registerHandler()}
            width={150}
          />
        </View>
      </View>
    </View>
  );
};

export default BaseJobCard;
