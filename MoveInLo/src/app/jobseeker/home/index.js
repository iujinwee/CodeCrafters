import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView } from "react-native";
import { Button, Modal } from "native-base";
import { router, useNavigation } from "expo-router";
import CalendarIcon from "@src/assets/splash/CalendarIcon.png";
import MoneyBagIcon from "@src/assets/splash/MoneyBagIcon.png";
import ClickIcon from "@src/assets/splash/ClickIcon.png";
import BusinessManIcon from "@src/assets/splash/BusinessManIcon.png";
import BriefCaseIcon from "@src/assets/splash/BriefCaseIcon.png";
import SuccessTickIcon from "@src/assets/splash/SuccessTickIcon.png";
import HandShakeIcon from "@src/assets/splash/HandShakeIcon.png";
import BaseCard from "@src/components/utils/card";
import ErrorAlert from "@src/components/utils/erroralert";
import * as Location from "expo-location";
import { Accuracy } from "expo-location";
import putCurrentLocation from "@src/api/progress/putCurrentLocation";
import * as SecureStore from "expo-secure-store";

const JobSeekerHomeUI = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigation();

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setShowAlert(true);
      setErrorMessage(
        "Permission to access location was denied. Please enable permission to access location."
      );
      return;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Accuracy.Highest,
    });

    if (location) {
      setCurrentLocation({
        long: location.coords.longitude,
        lat: location.coords.latitude,
      });

      try {
        console.log("Updating current location.");
        const accountId = await SecureStore.getItemAsync("accountId");
        await putCurrentLocation({
          accountId,
          location: {
            long: location.coords.longitude,
            lat: location.coords.latitude,
          },
        });
        console.log("current location: ", currentLocation);
      } catch (e) {
        setShowAlert(true);
        setErrorMessage("Failed to update user location in database.");
      }
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      try {
        getLocationPermission();
      } catch (e) {
        setShowAlert(true);
        setErrorMessage("Error thrown when getting location permission.");
      }
    });

    return () => {
      unsubscribe(); // Cleanup when the component is unmounted
    };
  }, []);

  const resetHandler = () => {
    setShowAlert(false);
  };

  return (
    <ScrollView>
      {showAlert && (
        <Modal isOpen={showAlert} onClose={() => resetHandler()}>
          <Modal.Content className={"bg-transparent"}>
            <Modal.Body>
              <ErrorAlert
                title={"Please enable location service."}
                message={errorMessage ?? "Location service is unavailable!"}
                onPress={() => resetHandler()}
                shown={showAlert}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )}
      <View className={"h-[105vh] mt-2"}>
        <Text className={`font-RobotoBold text-black text-2xl text-left p-5`}>
          Welcome back, Job Seeker!
        </Text>

        <View className={`flex-row space-x-4`}>
          <Button.Group mx={{ base: "auto" }}>
            <Button
              size="lg"
              variant="outline"
              colorScheme="muted"
              onPress={() => router.push("/jobseeker/joblistings/listings")}
              style={{ borderWidth: 3 }}
            >
              <View
                className={`flex-row justify-center items-center space-x-4`}
              >
                <Image
                  source={CalendarIcon}
                  style={{ width: 23, height: 23 }}
                />
                <Text className={"font-RobotoMedium text-1xl"}>
                  All Job Listings
                </Text>
              </View>
            </Button>
            <Button
              size="lg"
              variant="outline"
              colorScheme="muted"
              onPress={() => router.push("jobseeker/registered/jobs")}
              style={{ borderWidth: 3 }}
            >
              <View
                className={`flex-row justify-center items-center space-x-2`}
              >
                <Image
                  source={MoneyBagIcon}
                  style={{ width: 23, height: 23 }}
                />
                <Text className={"font-RobotoMedium text-1xl"}>
                  Registered Jobs
                </Text>
              </View>
            </Button>
          </Button.Group>
        </View>

        <Text
          className={`font-RobotoBold text-black text-xl text-left ml-10 py-3`}
          style={{ top: 10, right: 10 }}
        >
          How it Works!
        </Text>
        <View className={`flex flex-col space-x-8`}>
          <BaseCard
            index={1}
            title={"Select a Job"}
            source={ClickIcon}
            description={
              "Select a job from the list of available job shown above"
            }
          />
          <BaseCard
            index={2}
            title={"Register for a Job"}
            source={BusinessManIcon}
            description={"Register for the selected job"}
          />
          <BaseCard
            index={3}
            title={"View Registered Job"}
            source={BriefCaseIcon}
            description={
              "View your newly registered Job on your Registered Job List"
            }
          />
          <BaseCard
            index={4}
            title={"Check in on Job"}
            source={SuccessTickIcon}
            description={
              "When starting the Job, click `Check In` to indicate that the Job as started."
            }
          />
          <BaseCard
            index={5}
            title={"Complete Job"}
            source={HandShakeIcon}
            description={
              "After Job has been completed, click `Completed` to indicate that Job has been completed."
            }
          />
          <BaseCard
            index={6}
            title={"Receive Payment"}
            source={MoneyBagIcon}
            description={
              "Once payment has been received, click on `Payment Received`."
            }
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default JobSeekerHomeUI;
