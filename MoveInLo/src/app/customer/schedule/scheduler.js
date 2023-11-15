import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, Platform } from "react-native";
import { Modal } from "native-base";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import DateTimePicker from "react-native-modal-datetime-picker";
import BaseButton from "@src/components/utils/button";
import BaseInput from "@src/components/utils/inputbox";
import DateFormat from "@src/components/utils/dateformat";
import TimeFormat from "@src/components/utils/timeformat";
import ErrorAlert from "@src/components/utils/erroralert";
import postCreateService from "@src/api/service/postCreateService";
import getLocation from "@src/api/maps/getLocation";
import getCoordinates from "@src/api/maps/getCoordinates";
import compareDate from "@src/components/utils/compareDate";
import compareTime from "@src/components/utils/compareTime";
import * as SecureStore from "expo-secure-store";
import * as XCalendar from "expo-calendar";
import * as Localization from "expo-localization";
const { parse, addHours } = require("date-fns");

const SchedulerUI = () => {
  const { type } = useLocalSearchParams();
  const [info, setInfo] = useState({
    accountId: null,
    collectionDate: null,
    collectionTime: null,
    collectionAddress: null,
    deliveryDate: null,
    deliveryTime: null,
    deliveryAddress: null,
    serviceType: type,
  });
  const [deliveryDateModalVisible, setDeliveryDateModalVisible] =
    React.useState(false);
  const [collectionDateModalVisible, setCollectionDateModalVisible] =
    React.useState(false);
  const [deliveryTimeModalVisible, setDeliveryTimeModalVisible] =
    React.useState(false);
  const [collectionTimeModalVisible, setCollectionTimeModalVisible] =
    React.useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
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
  const navigation = useNavigation();
  const [collectionDate, setCollectionDate] = useState(null);
  const [collectionTime, setCollectionTime] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [validCollectionAddress, setValidCollectionAddress] = useState(false);
  const [validDeliveryAddress, setValidDeliveryAddress] = useState(false);
  const currentDate = new Date();

  const getAccountId = async () => {
    try {
      const accountId = await SecureStore.getItemAsync("accountId");
      await inputHandler(accountId, "accountId");
    } catch (e) {
      setErrorMessage("Error in fetching Account ID.");
      setShowAlert(true);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAccountId();
    });

    return () => {
      unsubscribe(); // Cleanup when the component is unmounted
    };
  }, [navigation]);

  const inputHandler = (input, field) => {
    setInfo((prevState) => ({ ...prevState, [field]: input }));
  };

  const resetHandler = () => {
    setShowAlert(false);
  };

  const dateHandler = (date, field) => {
    inputHandler(DateFormat(date), field);
    setCollectionDateModalVisible(false);
    setDeliveryDateModalVisible(false);
  };

  const timeHandler = (date, field) => {
    inputHandler(TimeFormat(date), field);
    setCollectionTimeModalVisible(false);
    setDeliveryTimeModalVisible(false);
  };

  const validInput = async () => {
    return (
      Object.keys(info).reduce((previousValue, currentValue) => {
        return previousValue && info[currentValue] != null;
      }, true) &&
      validDates() &&
      validDeliveryAddress &&
      validCollectionAddress
    );
  };

  const validDates = () => {
    if (compareDate(currentDate, collectionDate) === 0) {
      setErrorMessage("Collection Date has to be later than today's date!");
      return false;
    }
    if (
      compareDate(currentDate, collectionDate) === 2 &&
      compareTime(currentDate, collectionTime) === 0
    ) {
      setErrorMessage("Collection time should be later than current time!");
      return false;
    }
    if (compareDate(currentDate, deliveryDate) === 0) {
      setErrorMessage("Delivery date has to be 1 day later than today's date!");
      return false;
    }
    if (
      compareDate(currentDate, deliveryDate) === 2 &&
      compareTime(currentDate, deliveryTime) === 0
    ) {
      setErrorMessage("Delivery time has to be later than current time!");
      return false;
    }
    if (
      compareDate(collectionDate, deliveryDate) === 0 ||
      compareDate(collectionDate, deliveryDate) === 2
    ) {
      setErrorMessage(
        "Delivery date has to be 1 day later than collection date!"
      );
      return false;
    }
    return true;
  };

  const submitHandler = async () => {
    setErrorMessage(null);
    const valid = await validInput();
    if (valid) {
      try {
        console.log("Calling post to create service");

        // Get all calendar ids on device
        const { status } = await XCalendar.requestCalendarPermissionsAsync();
        const { timeZone } = Localization.getCalendars()[0];
        console.log(timeZone);
        // const customFormat = 'yyyy-MM-dd\'T\'HH:mm:ssXXX';
        let androidCalendar, iosCalendar;
        console.log("Getting calendar ids");

        if (Platform.OS === "ios") {
          if (status === "granted") {
            // get default ios calendar
            iosCalendar = await XCalendar.getDefaultCalendarAsync(
              XCalendar.EntityTypes.EVENT
            );
            console.log(iosCalendar);
          } else {
            console.log("Permission denied");
          }
        } else {
          if (status === "granted") {
            const androidCalendars = await XCalendar.getCalendarsAsync(
              XCalendar.EntityTypes.EVENT
            );
            androidCalendar = androidCalendars.find(
              (XCalendar) => XCalendar.isPrimary
            );
            console.log(androidCalendar);
          } else {
            console.log("Permission denied");
          }
        }

        await postCreateService(info).then((json) => {
          const validResponse = json !== null ? !!json.success : false;
          if (validResponse) {
            const serviceId = json.body.serviceId;
            const jobId = json.body.jobId;

            // Save IDs to SecureStore for future references (cache)
            SecureStore.setItemAsync("serviceId", serviceId);
            SecureStore.setItemAsync("jobId", jobId);
            console.log(`Saving ${serviceId} and ${jobId} to SecureStore`);

            try {
              // parse collection date and time into datetime object with correct time zone
              const isoCollect = parse(
                `${info.collectionDate} ${info.collectionTime}`,
                "d MMM yyyy h:mm a",
                new Date(),
                { timeZone }
              );
              console.log(isoCollect);

              // assume 2 hrs needed for collecting
              const endCollect = addHours(isoCollect, 2);

              // parse deliver date and time into datetime object with correct time zone
              const isoDeliver = parse(
                `${info.deliveryDate} ${info.deliveryTime}`,
                "d MMM yyyy h:mm a",
                new Date(),
                { timeZone }
              );
              console.log(isoDeliver);

              // assume 2 hrs needed for delivering
              const endDeliver = addHours(isoDeliver, 2);

              const eventCollection = {
                title: "MoveInLo",
                startDate: isoCollect,
                endDate: endCollect,
                location: info.collectionAddress,
                notes: serviceId + "," + jobId,
              };

              const eventDelivery = {
                title: "MoveInLo",
                startDate: isoDeliver,
                endDate: endDeliver,
                location: info.deliveryAddress,
                notes: serviceId + "," + jobId,
              };

              if (Platform.OS === "ios") {
                XCalendar.createEventAsync(iosCalendar.id, eventCollection);
                XCalendar.createEventAsync(iosCalendar.id, eventDelivery);
              } else {
                XCalendar.createEventAsync(androidCalendar.id, eventCollection);
                XCalendar.createEventAsync(androidCalendar.id, eventDelivery);
              }
            } catch (error) {
              console.error(error);
            }

            // Reroute to success page
            router.push("/customer/schedule/schedulesuccess");
          } else {
            setErrorMessage(json.body);
            setShowAlert(true);
          }
        });
      } catch (e) {
        errorMessage == null &&
          setErrorMessage("Error calling API endpoint to create service.");
        setShowAlert(true);
      }
    } else {
      setShowAlert(true);
    }
  };

  const onRegionChange = (region, field) => {
    if (field === "delivery") {
      setDeliveryRegion(region);
    } else {
      setCollectionRegion(region);
    }
  };

  const searchAddressHandler = async (field) => {
    const collection = field === "Collection";

    try {
      const res = await getLocation(
        collection ? info.collectionAddress : info.deliveryAddress
      );
      if (res.success) {
        const data = res.body;

        if (collection) {
          setCollectionRegion({
            ...collectionRegion,
            longitude: data.lng,
            latitude: data.lat,
          });
          setValidCollectionAddress(true);
        } else {
          setDeliveryRegion({
            ...deliveryRegion,
            longitude: data.lng,
            latitude: data.lat,
          });
          setValidDeliveryAddress(true);
        }
      } else {
        setShowAlert(true);
        setErrorMessage(res.body);
      }
    } catch (e) {
      setErrorMessage("Failed to find collection address using GoogleAPI.");
      setShowAlert(true);
    }
  };

  const searchCoordinatesHandler = async (field) => {
    const collection = field === "Collection";

    try {
      const res = await getCoordinates(
        collection ? collectionRegion : deliveryRegion
      );

      if (res.success) {
        const data = res.body;

        if (collection) {
          inputHandler(data, "collectionAddress");
          setValidCollectionAddress(true);
        } else {
          inputHandler(data, "deliveryAddress");
          setValidDeliveryAddress(true);
        }
      } else {
        setShowAlert(true);
        setErrorMessage(res.body);
      }
    } catch (e) {
      setErrorMessage("Failed to find collection address using GoogleAPI.");
      setShowAlert(true);
    }
  };

  return (
    <ScrollView className={"h-full m-3"}>
      {showAlert && (
        <Modal isOpen={showAlert} onClose={() => resetHandler()}>
          <Modal.Content className={"bg-transparent"}>
            <Modal.Body>
              <ErrorAlert
                title={"Please try again!"}
                message={errorMessage ?? "You have missing or invalid inputs!"}
                onPress={() => resetHandler()}
                shown={showAlert}
              />
            </Modal.Body>
          </Modal.Content>
        </Modal>
      )}
      <View className={"h-[150vh]"}>
        <View className={"flex flex-col m-3"}>
          <Text className={"font-RobotoBold text-2xl mt-2"}>
            Schedule{" "}
            <Text className={"text-secondary"}>
              Moving {type === "MoveIn" ? "In" : "Out"}
            </Text>{" "}
            Service
          </Text>

          <Text className={"font-RobotoMedium text-lg mt-4 underline"}>
            Part 1: Collection
          </Text>

          <View className={"flex flex-col mt-3"}>
            <Text className={"font-RobotoMedium"}>
              Choose a Collection Date
            </Text>

            <View className={"mt-2"}>
              <BaseButton
                primary
                textSize={13}
                title={info.collectionDate ?? "Select Date"}
                onPress={() => setCollectionDateModalVisible(true)}
              />

              <DateTimePicker
                isVisible={collectionDateModalVisible}
                mode={"date"}
                onConfirm={(date) => {
                  dateHandler(date, "collectionDate");
                  setCollectionDate(date);
                }}
                onCancel={() => setCollectionDateModalVisible(false)}
              />
            </View>
          </View>

          <View className={"mt-4"}>
            <Text className={"font-RobotoMedium"}>Set Collection Time</Text>

            <View className={"mt-2"}>
              <BaseButton
                primary
                textSize={13}
                title={info.collectionTime ?? "Select Time"}
                onPress={() => setCollectionTimeModalVisible(true)}
              />
            </View>

            <DateTimePicker
              isVisible={collectionTimeModalVisible}
              mode={"time"}
              onConfirm={(time) => {
                timeHandler(time, "collectionTime");
                setCollectionTime(time);
              }}
              onCancel={() => setCollectionTimeModalVisible(false)}
            />
          </View>

          <View className={"mt-4"}>
            <MapView
              className={"w-full h-52"}
              region={collectionRegion}
              onRegionChange={(region) => onRegionChange(region, "collection")}
            >
              <Marker
                coordinate={{
                  longitude: collectionRegion.longitude,
                  latitude: collectionRegion.latitude,
                }}
              />
            </MapView>

            <View className={"mt-4"}>
              <BaseButton
                primary
                title={"Search Coordinates"}
                onPress={() => searchCoordinatesHandler("Collection")}
                textSize={14}
                width={150}
              />
            </View>

            <View className={"mt-2"}>
              <BaseInput
                title="Enter Collection Address"
                placeholder={"e.g. 123 Main st."}
                defaultValue={info.collectionAddress}
                onChangeText={(address) => {
                  inputHandler(address, "collectionAddress");
                  setValidCollectionAddress(false);
                }}
              />
              <BaseButton
                primary
                title={"Search Address"}
                onPress={() => searchAddressHandler("Collection")}
                textSize={14}
                width={130}
              />
            </View>
          </View>

          {/* PART 2 */}
          <View className={"flex flex-col"}>
            <Text className={"font-RobotoMedium text-lg mt-4 underline"}>
              Part 2: Delivery
            </Text>

            <Text className={"font-RobotoMedium mt-4"}>
              Choose a Delivery Date
            </Text>

            <View className={"mt-2"}>
              <BaseButton
                primary
                textSize={13}
                title={info.deliveryDate ?? "Select Date"}
                onPress={() => setDeliveryDateModalVisible(true)}
              />

              <DateTimePicker
                isVisible={deliveryDateModalVisible}
                mode={"date"}
                onConfirm={(date) => {
                  dateHandler(date, "deliveryDate");
                  setDeliveryDate(date);
                }}
                onCancel={() => setDeliveryDateModalVisible(false)}
              />
            </View>
          </View>

          <View className={"mt-4"}>
            <Text className={"font-RobotoMedium"}>Set Delivery Time</Text>

            <View className={"mt-2"}>
              <BaseButton
                primary
                textSize={13}
                title={info.deliveryTime ?? "Select Time"}
                onPress={() => setDeliveryTimeModalVisible(true)}
              />
            </View>

            <DateTimePicker
              isVisible={deliveryTimeModalVisible}
              mode={"time"}
              onConfirm={(time) => {
                timeHandler(time, "deliveryTime");
                setDeliveryTime(time);
              }}
              onCancel={() => setDeliveryTimeModalVisible(false)}
            />
          </View>

          <View className={"mt-4"}>
            <MapView
              className={"w-full h-52"}
              initialRegion={deliveryRegion}
              region={deliveryRegion}
              onRegionChange={(region) => onRegionChange(region, "delivery")}
            >
              <Marker
                coordinate={{
                  longitude: deliveryRegion.longitude,
                  latitude: deliveryRegion.latitude,
                }}
              />
            </MapView>

            <View className={"mt-4"}>
              <BaseButton
                primary
                title={"Search Coordinates"}
                onPress={() => searchCoordinatesHandler("Delivery")}
                textSize={14}
                width={150}
              />
            </View>

            <View className={"mt-4"}>
              <BaseInput
                title="Enter Delivery Address"
                placeholder={"e.g. 123 Main st."}
                defaultValue={info.deliveryAddress}
                onChangeText={(address) => {
                  inputHandler(address, "deliveryAddress");
                  setValidDeliveryAddress(false);
                }}
              />
              <BaseButton
                primary
                title={"Search Address"}
                onPress={() => searchAddressHandler("Delivery")}
                textSize={14}
                width={130}
              />
            </View>
          </View>

          <View className={"flex flex-row justify-center items-center mt-6"}>
            <BaseButton
              title="Schedule"
              width="70%"
              onPress={() => submitHandler()}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              margin: 5,
            }}
          >
            <BaseButton title="Cancel" width="70%" onPress={router.back} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SchedulerUI;
