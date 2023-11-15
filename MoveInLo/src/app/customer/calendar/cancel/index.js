import React, { useEffect, useState } from "react";
import { Text, View, Image, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Modal } from "native-base";
import QuestionIcon from "@src/assets/splash/QuestionIcon.png";
import BaseButton from "@src/components/utils/button";
import postWithdrawService from "@src/api/service/postWithdrawService";
import ErrorAlert from "@src/components/utils/erroralert";
import * as SecureStore from "expo-secure-store";
import * as XCalendar from "expo-calendar";
import * as Localization from "expo-localization";
import getServiceInfo from "@src/api/service/getServiceInfo";
import { parse } from "date-fns";

const CancelServiceUI = () => {
  const { notes } = useLocalSearchParams();
  console.log(notes);
  // const { collectionDate,collectionTime,deliveryDate,deliveryTime } = useLocalSearchParams();
  // console.log(collectionDate, collectionTime, deliveryDate, deliveryTime);

  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [serviceInfo, setServiceInfo] = useState(null);
  const [trackerInfo, setTrackerInfo] = useState({
    accountId: "",
    serviceId: "",
    jobId: "",
  });

  const getTrackerInfo = async () => {
    try {
      const accountId = await SecureStore.getItemAsync("accountId");
      console.log("account: ", accountId);

      const serviceId = notes ? notes.split(",")[0] : null;
      console.log("serviceId: ", serviceId);

      const jobId = notes ? notes.split(",")[1] : null;
      console.log("jobId: ", jobId);

      const retrievedService = await getServiceInfo(serviceId);
      const serviceInfo = retrievedService.body.serviceInfo[0];
      setServiceInfo(serviceInfo);

      setTrackerInfo({ accountId, serviceId, jobId });
    } catch (e) {
      setErrorMessage("Error fetching info to cancel service.");
      setShowAlert(true);
    }
  };

  useEffect(() => {
    async function prepare() {
      await getTrackerInfo();
    }
    prepare();
  }, []);

  const resetHandler = () => {
    setShowAlert(false);
  };

  const withdrawHandler = async () => {
    try {
      let androidCalendar, iosCalendar;

      const { status } = await XCalendar.requestCalendarPermissionsAsync();
      console.log(status);

      const { timeZone } = Localization.getCalendars()[0];

      if (Platform.OS === "ios") {
        if (status === "granted") {
          // get default ios calendar
          iosCalendar = await XCalendar.getDefaultCalendarAsync(
            XCalendar.EntityTypes.EVENT
          );
          console.log(iosCalendar.id);

          const isoCollect = parse(
            `${serviceInfo.collectionDate} ${serviceInfo.collectionTime}`,
            "dd MMM yyyy h:mm a",
            new Date(),
            { timeZone }
          );
          console.log("iso", isoCollect);

          const isoDeliver = parse(
            `${serviceInfo.deliveryDate} ${serviceInfo.deliveryTime}`,
            "dd MMM yyyy h:mm a",
            new Date(),
            { timeZone }
          );
          console.log(isoDeliver);

          isoCollect.setDate(isoCollect.getDate() - 1);
          isoDeliver.setDate(isoDeliver.getDate() + 1);

          const eventsInRange = await XCalendar.getEventsAsync(
            [iosCalendar.id],
            isoCollect,
            isoDeliver
          );

          const filtered = eventsInRange.filter((event) => {
            return event.notes === notes;
          });

          console.log(filtered);
          for (const events of filtered) {
            await XCalendar.deleteEventAsync(events.id);
          }
          // console.log(iosCalendar);
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
      await postWithdrawService(trackerInfo).then((json) => {
        const validResponse = json !== null ? !!json.success : false;
        if (validResponse) {
          router.push("customer/calendar/cancel/success");
        } else {
          setErrorMessage(json.body);
          setShowAlert(true);
        }
      });
    } catch (e) {
      console.log(e);
      setErrorMessage("Error calling API endpoint to cancel service.");
      setShowAlert(true);
    }
  };

  return (
    <View
      style={{
        alignContent: "center",
        justifyContent: "center",
        flex: true,
        flexDirection: "column",
        display: "flex",
      }}
    >
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
      <View className={`flex flex-column`}>
        <View
          className={"flex flex-row"}
          style={{ margin: 10, justifyContent: "center" }}
        >
          <Image source={QuestionIcon} />
        </View>
        <View
          className={"flex flex-column"}
          style={{
            margin: 10,
            justifyContent: "center",
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bold",
              color: "#181C62",
            }}
          >
            Cancel Moving Service?
          </Text>
          <Text
            style={{
              fontSize: 15,
              textAlign: "center",
              color: "#181C62",
              margin: -40,
              marginBottom: -60,
              padding: 60,
            }}
          >
            We will remove your scheduled moving service if you intend to
            withdraw.
          </Text>
        </View>
        <View
          className={"flex flex-row"}
          style={{ justifyContent: "space-evenly", marginTop: 13 }}
        >
          <BaseButton
            style={{
              backgroundColor: "#181C62",
              padding: 8,
              paddingLeft: 15,
              paddingRight: 15,
              borderRadius: 7,
            }}
            secondary
            title="Cancel"
            onPress={() => withdrawHandler()}
          />
          <BaseButton
            style={{
              backgroundColor: "#181C62",
              padding: 8,
              paddingLeft: 15,
              paddingRight: 15,
              borderRadius: 7,
            }}
            title="Back"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </View>
  );
};

export default CancelServiceUI;
