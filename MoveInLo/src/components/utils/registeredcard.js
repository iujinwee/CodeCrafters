import { Image, Text, View } from "react-native";
import React from "react";
import BaseButton from "@src/components/utils/button";
import { router } from "expo-router";

const BaseRegisteredCard = ({
  title,
  description,
  source,
  accountId,
  serviceId,
  jobId,
}) => {
  const size = 75;

  const detailsHandler = () => {
    router.replace("/");
    router.push({
      pathname: "jobseeker/registered/tracker/progress",
      params: { accountId, jobId, serviceId },
    });
  };

  const withdrawHandler = () => {
    router.push({
      pathname: "jobseeker/registered/withdrawal/request",
      params: { accountId, jobId },
    });
  };

  return (
    <View className={"flex flex-row mx-5 my-3 pb-2 border-b-[1px] border-gray"}>
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

        <View className={"flex flex-row justify-center space-x-4 my-2"}>
          <View>
            <BaseButton
              secondary
              title={"Withdraw"}
              onPress={() => withdrawHandler()}
            />
          </View>
          <View>
            <BaseButton
              primary
              title={"Details"}
              onPress={() => detailsHandler()}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default BaseRegisteredCard;
