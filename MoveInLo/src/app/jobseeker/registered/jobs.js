import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "native-base";
import { Text, View } from "react-native";
import House from "@src/assets/splash/House.png";
import BaseRegisteredCard from "@src/components/utils/registeredcard";
import ErrorAlert from "@src/components/utils/erroralert";
import getRegisteredJobListings from "@src/api/job/getRegisteredJobListings";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";

const RegisteredJobsUI = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [registeredJobs, setRegisteredJobs] = useState([]);

  const fetchRegisteredJobListings = async () => {
    try {
      const accountId = await SecureStore.getItemAsync("accountId");
      const json = await getRegisteredJobListings(accountId);
      const validResponse = json !== null ? !!json.success : false;
      if (validResponse) {
        setRegisteredJobs(json.body);
      }
    } catch (e) {
      setErrorMessage("Error fetching info for registered job listings.");
      setShowAlert(true);
    }
  };

  const resetHandler = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    async function prepare() {
      try {
        await fetchRegisteredJobListings();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    if (!appIsReady) {
      prepare();
    }
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView}>
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
      <Text
        className={`font-RobotoBold text-black text-2xl text-left p-5 mt-2`}
      >
        Registered Jobs
      </Text>

      {!registeredJobs.length ? (
        <View className={"flex w-full items-center justify-center px-5 "}>
          <View className={"px-5 border-t-2 w-full "}>
            <Text
              className={
                "text-center font-RobotoMedium text-lg text-secondary mt-5"
              }
            >
              No Registered Jobs Found!
            </Text>
          </View>
        </View>
      ) : (
        registeredJobs.map((job, index) => {
          return (
            <BaseRegisteredCard
              key={index}
              accountId={job.recipientId} // Send the recipient accountId
              jobId={job.jobId}
              serviceId={job.serviceId}
              source={House}
              title={job.title}
              description={job.subtitle}
            />
          );
        })
      )}
    </View>
  );
};

export default RegisteredJobsUI;
