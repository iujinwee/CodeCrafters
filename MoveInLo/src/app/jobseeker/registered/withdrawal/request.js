import React, { useState } from "react";
import { Modal } from "native-base";
import { Screen } from "react-native-screens";
import { Text, View, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import QuestionIcon from "@src/assets/splash/QuestionIcon.png";
import BaseButton from "@src/components/utils/button";
import postWithdrawJob from "@src/api/job/postWithdrawJob";
import ErrorAlert from "@src/components/utils/erroralert";

const router = useRouter();

const JobWithdrawalRequestUI = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { accountId, jobId } = useLocalSearchParams();

  const withdrawHandler = async () => {
    try {
      await postWithdrawJob({ accountId, jobId }).then((json) => {
        const validResponse = json !== null ? !!json.success : false;
        if (validResponse) {
          router.push("jobseeker/registered/withdrawal/success");
        } else {
          setErrorMessage(json.body);
          setShowAlert(true);
        }
      });
    } catch (e) {
      setErrorMessage("Error fetching info to cancel service.");
      setShowAlert(true);
    }
  };

  const resetHandler = () => {
    setShowAlert(false);
  };

  return (
    <View>
      {showAlert && (
        <Modal isOpen={showAlert} onClose={() => resetHandler()}>
          <Modal.Content className={"bg-transparent"}>
            <Modal.Body>
              <ErrorAlert
                title={"Please try again!"}
                message={errorMessage ?? "Failed to cancel service"}
                onPress={() => resetHandler()}
                shown={showAlert}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )}
      <Screen
        className={`flex flex-col h-full w-full items-center justify-center`}
        style={{ top: 17 }}
      >
        <Image source={QuestionIcon} style={{ alignSelf: "center" }} />
        <Text
          className={`font-RobotoBold text-black text-2xl text-center mt-4`}
        >
          Withdraw Registered Job?
        </Text>
        <View className={"w-4/5"}>
          <Text
            className={`font-RobotoRegular text-black text-center mt-4`}
            style={{ fontSize: 15 }}
          >
            We will send an application to our team for review if you intend to
            withdraw
          </Text>
        </View>

        <View className={`text-2xl items-center mt-6`}>
          <BaseButton
            secondary
            title={"Withdraw"}
            onPress={() => withdrawHandler()}
            width={140}
          />
        </View>
      </Screen>
    </View>
  );
};

export default JobWithdrawalRequestUI;
