import React, { useCallback, useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Modal } from "native-base";
import { SERVICE_STATUS } from "@server/enum/ServiceStatus";
import { SERVICE_TYPE } from "@server/enum/ServiceType";
import BaseButton from "@src/components/utils/button";
import TextDisplay from "@src/components/utils/textdisplay";
import ErrorAlert from "@src/components/utils/erroralert";
import getServiceInfo from "@src/api/service/getServiceInfo";
import getUserInfo from "@src/api/auth/getUserInfo";
import getJobProgress from "@src/api/progress/getJobProgress";
import putUpdateCollection from "@src/api/progress/putUpdateCollection";
import putUpdateDelivered from "@src/api/progress/putUpdateDelivered";
import putUpdatePaid from "@src/api/progress/putUpdatePaid";
import * as SplashScreen from "expo-splash-screen";
import getLocation from "@src/api/maps/getLocation";
import MapView, { Marker } from "react-native-maps";

const JobSeekerTrackerUI = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { accountId, serviceId, jobId } = useLocalSearchParams();
  const [jobInfo, setJobInfo] = useState({});
  const [personnelInfo, setPersonnelInfo] = useState({});
  const [serviceStatus, setServiceStatus] = useState(SERVICE_STATUS.PENDING);
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

  const fetchAllData = async () => {
    try {
      Promise.all([
        getServiceInfo(serviceId),
        getUserInfo(accountId),
        getJobProgress(jobId),
      ])
        .then(async ([serviceData, userData, progressData]) => {
          const jobDetails = serviceData.body.serviceInfo[0];
          setJobInfo(jobDetails);
          setPersonnelInfo(userData.body);
          setServiceStatus(progressData.body.progress);
          await getLocationCoordinates(jobDetails);
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage("Error retrieving progress information.");
          setShowAlert(true);
        });
    } catch (e) {
      setErrorMessage("Error retrieving data.");
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
        await fetchAllData();
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

  const resetHandler = () => {
    setShowAlert(false);
  };

  const updateCheckIn = async () => {
    try {
      const json = await putUpdateCollection({ jobId });
      const validResponse = json !== null ? !!json.success : false;
      if (validResponse) {
        await getJobProgress(jobId);
        setServiceStatus(SERVICE_STATUS.PROGRESS);
      } else {
        setErrorMessage("Error when checking in.");
        setShowAlert(true);
      }
    } catch (e) {
      setErrorMessage("Error when checking in.");
      setShowAlert(true);
    }
  };

  const updateWithdraw = () => {
    router.replace("/");
    router.push({
      pathname: "jobseeker/registered/withdrawal/request",
      params: { accountId, jobId },
    });
  };

  const updateCompleted = async () => {
    try {
      const json = await putUpdateDelivered({ jobId });
      const validResponse = json !== null ? !!json.success : false;
      if (validResponse) {
        await getJobProgress(jobId);
        setServiceStatus(SERVICE_STATUS.DELIVERED);
      }
    } catch (e) {
      setErrorMessage("Error when updating completion.");
      setShowAlert(true);
    }
  };

  const updatePayment = async () => {
    try {
      const json = await putUpdatePaid({ jobId });
      const validResponse = json !== null ? !!json.success : false;
      if (validResponse) {
        router.push("jobseeker/registered/tracker/payment");
      } else {
        setErrorMessage("Did not update to paid.");
        setShowAlert(true);
      }
    } catch (e) {
      setErrorMessage("Error when updating payment.");
      setShowAlert(true);
    }
  };

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
      {appIsReady && (
        <View className={"h-full m-6"} onLayout={onLayoutRootView}>
          <Text className={"font-RobotoBold text-2xl"}>Progress Tracker</Text>

          <View
            className={
              "inline-block top-[107px] mx-[70px] border-b-[1px] border-primary"
            }
          />
          <View
            className={"flex flex-row"}
            style={{ justifyContent: "space-evenly", gap: 20, marginTop: 20 }}
          >
            <View
              className={"flex flex-column"}
              style={{ justifyContent: "center", alignItems: "center", gap: 5 }}
            >
              <Text style={{ fontSize: 25 }}>📅</Text>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Scheduled
              </Text>

              {serviceStatus === SERVICE_STATUS.PENDING ? (
                <Text style={{ marginTop: 20 }}>●</Text>
              ) : (
                <Text style={{ marginTop: 20 }}>○</Text>
              )}
            </View>

            <View
              className={"flex flex-column"}
              style={{ justifyContent: "center", alignItems: "center", gap: 5 }}
            >
              <Text style={{ fontSize: 25 }}>🚚</Text>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                In Progress
              </Text>

              {serviceStatus === SERVICE_STATUS.PROGRESS ? (
                <Text style={{ marginTop: 20 }}>●</Text>
              ) : (
                <Text style={{ marginTop: 20 }}>○</Text>
              )}
            </View>

            <View
              className={"flex flex-column"}
              style={{ justifyContent: "center", alignItems: "center", gap: 5 }}
            >
              <Text style={{ fontSize: 25 }}>📦</Text>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                Delivered!
              </Text>

              {serviceStatus === SERVICE_STATUS.DELIVERED ? (
                <Text style={{ marginTop: 20 }}>●</Text>
              ) : (
                <Text style={{ marginTop: 20 }}>○</Text>
              )}
            </View>
          </View>

          <View
            className={"flex flex-column"}
            style={{
              justifyContent: "space-between",
              borderWidth: 1,
              borderRadius: 5,
              margin: 10,
              marginLeft: 40,
              marginRight: 40,
              marginTop: 20,
              padding: 12,
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              {serviceStatus === SERVICE_STATUS.PENDING
                ? "Collection"
                : "Delivery"}{" "}
              Information
            </Text>

            <TextDisplay
              title={"Date/ Time"}
              content={
                serviceStatus === SERVICE_STATUS.PENDING
                  ? jobInfo.collectionDate + ", " + jobInfo.collectionTime
                  : jobInfo.deliveryDate + ", " + jobInfo.deliveryTime
              }
            />
            <TextDisplay
              title={"Address"}
              content={
                serviceStatus === SERVICE_STATUS.PENDING
                  ? jobInfo.collectionAddress
                  : jobInfo.deliveryAddress
              }
            />

            <TextDisplay
              title={"Service"}
              content={
                jobInfo.type === SERVICE_TYPE.MOVEIN ? "Move In" : "Move Out"
              }
            />
          </View>

          <View
            className={"flex flex-column"}
            style={{
              justifyContent: "space-between",
              borderWidth: 1,
              borderRadius: 5,
              margin: 10,
              marginLeft: 40,
              marginRight: 40,
              marginTop: 15,
              padding: 12,
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              Intended Recipient
            </Text>
            <TextDisplay title={"Name"} content={personnelInfo.username} />
            <TextDisplay
              title={"Contact number"}
              content={personnelInfo.number}
            />
          </View>

          {/* GOOGLE MAP */}
          {serviceStatus === SERVICE_STATUS.DELIVERED ? (
            <View
              className={
                "mt-4 flex flex-col item-center justify-center border-2 border-primary p-5 rounded-xl"
              }
            >
              <Text className={"font-RobotoBold text-center text-lg"}>
                Thank you for your service!{" "}
              </Text>
              <Text className={"font-RobotoRegular text-center mt-2"}>
                Our team will contact you regarding the payment.
              </Text>
              <Text className={"font-RobotoRegular text-center"}>
                Do indicate here once you have received the payment
              </Text>
            </View>
          ) : (
            <View
              className={"flex flex-row"}
              style={{ justifyContent: "center", borderWidth: 2, margin: 10 }}
            >
              <MapView
                className={"w-full h-56"}
                region={
                  serviceStatus === SERVICE_STATUS.PENDING
                    ? collectionRegion
                    : deliveryRegion
                }
              >
                <Marker
                  coordinate={{
                    longitude:
                      serviceStatus === SERVICE_STATUS.PENDING
                        ? collectionRegion.longitude
                        : deliveryRegion.longitude,
                    latitude:
                      serviceStatus === SERVICE_STATUS.PENDING
                        ? collectionRegion.latitude
                        : deliveryRegion.latitude,
                  }}
                />
              </MapView>
            </View>
          )}

          {/* DYNAMIC BUTTONS */}
          {serviceStatus === SERVICE_STATUS.PENDING ? (
            <View
              className={
                "flex flex-row space-x-4 items-center justify-center mt-2"
              }
            >
              <View>
                <BaseButton
                  primary
                  width={140}
                  title="Check In"
                  onPress={() => updateCheckIn()}
                />
              </View>
              <View>
                <BaseButton
                  secondary
                  width={140}
                  title="Withdraw"
                  onPress={() => updateWithdraw()}
                />
              </View>
            </View>
          ) : serviceStatus === SERVICE_STATUS.PROGRESS ? (
            <View
              className={
                "flex flex-row space-x-4 items-center justify-center mt-4"
              }
            >
              <View>
                <BaseButton
                  primary
                  width={180}
                  title="Completed"
                  onPress={() => updateCompleted()}
                />
              </View>
            </View>
          ) : (
            <View
              className={
                "flex flex-row space-x-4 items-center justify-center mt-4"
              }
            >
              <BaseButton
                primary
                width={180}
                title="Payment Received"
                onPress={() => updatePayment()}
              />
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default JobSeekerTrackerUI;
