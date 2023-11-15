import { Text, View } from "react-native";
import BaseButton from "@src/components/utils/button";
import { Checkbox, FlatList, HStack } from "native-base";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ErrorAlert from "@src/components/utils/erroralert";
import { ACCOUNT_TYPE } from "@server/enum/AccountType";

const PDPAUI = () => {
  const [acknowledged, setAcknowledged] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();
  const { type } = useLocalSearchParams();
  const redirectLink =
    type === ACCOUNT_TYPE.CUSTOMER ? "customer/home" : "jobseeker/home";

  const acknowledgementHandler = () => {
    if (acknowledged) {
      router.push({ pathname: redirectLink });
    } else {
      setShowAlert(true);
    }
  };

  return (
    <View className={"h-full w-full items-center"}>
      <View className={"absolute z-10 w-3/4"}>
        {showAlert && (
          <ErrorAlert
            title={"Please acknowledge"}
            message={""}
            onPress={() => setShowAlert(false)}
            shown={showAlert}
          />
        )}
      </View>
      <View className={"w-5/6 mt-16"}>
        <Text className={"font-RobotoBold text-xl text-center"}>
          Personal Data Protection Act (PDPA)
        </Text>
        <Text className={"font-RobotoMedium mt-4"}>
          We may collect and use your personal data for any or all of the
          following purposes:
        </Text>
        <View className={"mt-2"}>
          <FlatList
            data={[
              {
                key: "performing obligations in the course of or in connection with our provision of the goods and/or services requested by you;",
              },
              { key: "verifying your identity;" },
              {
                key: "responding to, handling, and processing queries, requests,applications, complaints, and feedback from you;",
              },
              {
                key: "complying with any applicable laws, regulations, codes of practice, guidelines, or rules, or to assist in law enforcement and investigations conducted by any governmental and/or regulatory authority;",
              },
            ]}
            renderItem={({ item }) => {
              return (
                <View className={"flex flex-row m-1"}>
                  <Text>{"\u2022"}</Text>
                  <Text className={"font-RobotoRegular text-justify ml-2"}>
                    {item.key}
                  </Text>
                </View>
              );
            }}
          />
        </View>
        <Text className={"font-RobotoMedium mt-4"}>
          We may disclose your personal data:
        </Text>
        <View className={"mt-2"}>
          <FlatList
            data={[
              {
                key: "where such disclosure is required for performing obligations in the course of or in connection with our provision of the goods or services requested by you; ",
              },
              {
                key: "or to third party service providers, agents and other organisations we have engaged to perform any of the functions listed in clause 5 above for us.",
              },
            ]}
            renderItem={({ item }) => {
              return (
                <View className={"flex flex-row m-1"}>
                  <Text>{"\u2022"}</Text>
                  <Text className={"font-RobotoRegular text-justify ml-2"}>
                    {item.key}
                  </Text>
                </View>
              );
            }}
          />
        </View>

        <Text className={"text-justify mt-4 font-RobotoRegular tracking-wide"}>
          The purposes listed in the above clauses may continue to apply even in
          situations where your relationship with us (for example, pursuant to a
          contract) has been terminated or altered in any way, for a reasonable
          period thereafter (including, where applicable, a period to enable us
          to enforce our rights under any contract with you).
        </Text>

        <HStack className={"mt-5 flex flex-row items-center"}>
          <Checkbox
            value={acknowledged.toString()}
            onChange={() => setAcknowledged(!acknowledged)}
            colorScheme={"darkBlue"}
            accessibilityLabel={"Acknowledgement checkbox"}
          >
            <Text className={"font-RobotoMedium"}>
              I accept the terms & conditions.
            </Text>
          </Checkbox>
        </HStack>

        <View className={"mt-5 w-full"}>
          <BaseButton
            title={"Acknowledge"}
            onPress={acknowledgementHandler}
            width={"%full%"}
          />
        </View>
      </View>
    </View>
  );
};

export default PDPAUI;
