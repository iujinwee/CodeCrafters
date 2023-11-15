import { Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "react-native-screens";
import BaseButton from "@src/components/utils/button";
import SuccessTickIcon from "@src/assets/splash/SuccessTickIcon.png";

const router = useRouter();

const JobAllocatedUI = () => {
  const submitHandler = () => {
    router.replace("/");
    router.push("jobseeker/registered/jobs");
  };

  return (
    <Screen
      className={`w-full h-full flex flex-col items-center justify-center`}
    >
      <Image source={SuccessTickIcon} style={{ alignSelf: "center" }} />
      <Text className={`font-RobotoBold text-black text-2xl text-center mt-4`}>
        Moving Service Job Registered!
      </Text>
      <View className={"w-4/5"}>
        <Text
          className={`font-RobotoRegular text-black text-center mt-4`}
          style={{ fontSize: 15 }}
        >
          Be sure to check in to this app on your designated moving date.
        </Text>
      </View>

      <View className={`text-2xl items-center mt-6`}>
        <BaseButton
          primary
          title={"View Registered Jobs"}
          onPress={() => submitHandler()}
          width={200}
        />
      </View>
    </Screen>
  );
};

export default JobAllocatedUI;
