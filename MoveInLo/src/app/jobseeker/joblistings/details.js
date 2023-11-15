import React, { useCallback, useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Modal, ScrollView } from "native-base";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BaseButton from "@src/components/utils/button";
import TextDisplay from "@src/components/utils/textdisplay";
import ErrorAlert from "@src/components/utils/erroralert";
import getServiceInfo from "@src/api/service/getServiceInfo";
import postAcceptJob from "@src/api/job/postAcceptJob";
import getLocation from "@src/api/maps/getLocation";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";

const router = useRouter();
SplashScreen.preventAutoHideAsync();

const ViewMovingJobUI = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [jobInfo, setJobInfo] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { serviceId, jobId } = useLocalSearchParams();
  const [collectionRegion, setCollectionRegion] = useState({
    latitude: 1.3483,
    longitude: 103.6831,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [deliveryRegion, setDeliveryRegion] = useState({
    latitude: 1.3483,
    longitude: 103.6831,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const registerHandler = async () => {
    try {
      const accountId = await SecureStore.getItemAsync("accountId");
      const json = await postAcceptJob({ accountId, jobId });

      const validResponse = json !== null ? !!json.success : false;
      if (validResponse) {
        router.replace("/");
        router.push("/jobseeker/registered/register/success");
      }
    } catch (e) {
      setErrorMessage("Error registering job.");
      setShowAlert(true);
    }
  };

  const resetHandler = () => {
    setShowAlert(false);
  };

  const getJobDetails = async () => {
    try {
      const json = await getServiceInfo(serviceId);
      const validResponse = json !== null ? !!json.success : false;
      if (validResponse) {
        const jobDetails = json.body.serviceInfo[0];
        setJobInfo(jobDetails);
        console.log(jobDetails);
        await getLocationCoordinates(jobDetails);
      }
    } catch (e) {
      setErrorMessage("Error fetching job details from API.");
      setShowAlert(true);
    }
  };

  const getLocationCoordinates = async (info) => {
    try {
      const resCollection = await getLocation(info.collectionAddress);
      const resDelivery = await getLocation(info.deliveryAddress);

      if (resCollection.success) {
        const data = resCollection.body;

        setCollectionRegion({
          ...collectionRegion,
          longitude: data.lng,
          latitude: data.lat,
        });
      } else {
        setShowAlert(true);
        setErrorMessage("Failed to get collection map coordinates.");
      }

      console.log(resCollection, resDelivery);
      if (resDelivery.success) {
        const data = resDelivery.body;

        setDeliveryRegion({
          ...deliveryRegion,
          longitude: data.lng,
          latitude: data.lat,
        });
      } else {
        setShowAlert(true);
        setErrorMessage("Failed to get delivery map coordinates.");
      }
    } catch (e) {
      setErrorMessage("Error fetching map coordinates.");
      setShowAlert(true);
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await getJobDetails();
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
        <View className={"h-[100vh] flex mx-6 mt-10"}>
          <Text className={`font-RobotoBold text-black text-2xl text-center`}>
            Moving Service Job Information
          </Text>
          <View>
            <View
              className={"flex flex-col p-4 mt-4 rounded-lg border space-y-2"}
            >
              <Text
                className={"text-center font-RobotoBold text-xl text-primary"}
              >
                Collection Details
              </Text>
              <View>
                <TextDisplay
                  title={"Collection Date"}
                  content={
                    jobInfo.collectionDate + ", " + jobInfo.collectionTime
                  }
                />
              </View>

              <View>
                <TextDisplay
                  title={"Collection Address"}
                  content={jobInfo.collectionAddress}
                />
              </View>

              <MapView className={"w-full h-56"} region={collectionRegion}>
                <Marker
                  coordinate={{
                    longitude: collectionRegion.longitude,
                    latitude: collectionRegion.latitude,
                  }}
                />
              </MapView>
            </View>

            <View
              className={"flex flex-col p-4 mt-4 rounded-lg border space-y-2"}
            >
              <Text
                className={"text-center font-RobotoBold text-xl text-secondary"}
              >
                Delivery Details
              </Text>

              <View>
                <TextDisplay
                  title={"Delivery Date"}
                  content={jobInfo.deliveryDate + ", " + jobInfo.deliveryTime}
                />
              </View>

              <View>
                <TextDisplay
                  title={"Delivery Address"}
                  content={jobInfo.deliveryAddress}
                />
              </View>

              <MapView className={"w-full h-56"} region={deliveryRegion}>
                <Marker
                  coordinate={{
                    longitude: deliveryRegion.longitude,
                    latitude: deliveryRegion.latitude,
                  }}
                />
              </MapView>
            </View>

            <View className={`text-2xl items-center mt-5`}>
              <BaseButton
                primary
                title={"Register"}
                onPress={() => registerHandler()}
                width={200}
              />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ViewMovingJobUI;
