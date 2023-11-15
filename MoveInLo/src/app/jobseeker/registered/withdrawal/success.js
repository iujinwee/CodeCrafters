import { Text, View, Image } from "react-native";
import BaseButton from "@src/components/utils/button";
import { useRouter } from "expo-router";
import SuccessTickIcon from "@src/assets/splash/SuccessTickIcon.png";
import { Screen } from "react-native-screens";

const router = useRouter();

const JobWithdrawalSuccessUI = () => {
  const backHandler = () => {
    router.replace("/");
    router.push("jobseeker/joblistings/listings");
  };
  return (
    <View>
      <Screen
        className={`h-full w-full flex flex-col items-center justify-center `}
        style={{ top: 17 }}
      >
        <Image source={SuccessTickIcon} style={{ alignSelf: "center" }} />
        <Text
          className={`font-RobotoBold text-black text-2xl text-center mt-2`}
        >
          Withdrawn Application Sent!
        </Text>
        <View className={"w-4/5 mt-2"}>
          <Text
            className={`font-RobotoRegular text-black text-center mt-2`}
            style={{ fontSize: 15 }}
          >
            Our team will contact you once your application to withdraw has been
            approved.
          </Text>
        </View>

        <View className={`text-2xl items-center mt-5`}>
          <BaseButton
            primary
            title={"Job Listings"}
            onPress={() => backHandler()}
            width={200}
          />
        </View>
      </Screen>
    </View>
  );
};

export default JobWithdrawalSuccessUI;
