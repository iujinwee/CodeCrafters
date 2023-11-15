import { Text, View } from "react-native";
import HouseIcon from "@src/assets/splash/House.png";
import { Modal, ScrollView } from "native-base";
import BaseJobCard from "@src/components/utils/jobcard";
import React, { useCallback, useEffect, useState } from "react";
import ErrorAlert from "@src/components/utils/erroralert";
import getJobListings from "@src/api/job/getJobListings";
import * as SplashScreen from "expo-splash-screen";

const JobListingsUI = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [jobListings, setJobListings] = useState([]);

  const fetchJobListings = async () => {
    try {
      const json = await getJobListings();
      const validResponse = json !== null ? !!json.success : false;
      if (validResponse) {
        setJobListings(json.body);
      }
    } catch (e) {
      setErrorMessage("Error fetching info for job listings.");
      setShowAlert(true);
    }
  };

  const resetHandler = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    async function prepare() {
      try {
        await fetchJobListings();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
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
    <ScrollView>
      <View className={"h-full w-full mt-2"} onLayout={onLayoutRootView}>
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
        <Text className={`font-RobotoBold text-black text-2xl text-left m-6`}>
          Job Listings
        </Text>

        <View className={`flex-col`}>
          {!jobListings.length ? (
            <View
              className={
                "flex h-full w-full items-center justify-center px-5 -mt-4"
              }
            >
              <View className={"px-5 border-t-2 w-full "}>
                <Text
                  className={
                    "text-center font-RobotoMedium text-lg text-secondary mt-5"
                  }
                >
                  No Jobs Found!
                </Text>
              </View>
            </View>
          ) : (
            jobListings.map((job, index) => {
              return (
                <BaseJobCard
                  key={index}
                  listingInfo={{
                    serviceId: job.serviceId,
                    jobId: job.jobId,
                  }}
                  source={HouseIcon}
                  title={job.title}
                  description={job.subtitle}
                />
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default JobListingsUI;
