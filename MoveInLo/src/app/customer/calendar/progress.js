import React, { useCallback, useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Modal } from "native-base";
import { SERVICE_STATUS } from "@server/enum/ServiceStatus";
import { SERVICE_TYPE } from "@server/enum/ServiceType";
import MapView, { Marker } from "react-native-maps";
import BaseButton from "@src/components/utils/button";
import TextDisplay from "@src/components/utils/textdisplay";
import ErrorAlert from "@src/components/utils/erroralert";
import getServiceInfo from "@src/api/service/getServiceInfo";
import getUserInfo from "@src/api/auth/getUserInfo";
import getJobProgress from "@src/api/progress/getJobProgress";
import * as SplashScreen from "expo-splash-screen";
import getLocation from "@src/api/maps/getLocation";
import * as SecureStore from "expo-secure-store";
import JobSeekerIcon from "@src/assets/splash/DeliveryIcon.png";

const CustomerTrackerUI = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
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
  const [idStore, setIdStore] = useState({
    accountId: null,
    serviceId: null,
    jobId: null,
  });
  const [jobSeeker, setJobSeeker] = useState({
    long: null,
    lat: null,
  });
  const { notes } = useLocalSearchParams();

  const fetchAccount = async (notes) => {
    const accountId = await SecureStore.getItemAsync("accountId");
    const noteData = notes ? notes.split(",") : null;

    setIdStore({
      accountId,
      serviceId: noteData[0],
      jobId: noteData[1],
    });
  };
  const fetchAllData = async () => {
    if (
      idStore.jobId != null &&
      idStore.accountId != null &&
      idStore.serviceId != null
    ) {
      try {
        Promise.all([
          getServiceInfo(idStore.serviceId),
          getJobProgress(idStore.jobId),
        ])
          .then(async ([serviceData, progressData]) => {
            const jobDetails = serviceData.body.serviceInfo[0];
            if (progressData.body.id) {
              const deliveryPersonnel = (
                await getUserInfo(progressData.body.id)
              ).body;
              setPersonnelInfo(deliveryPersonnel);
              setJobSeeker({
                long: deliveryPersonnel.long,
                lat: deliveryPersonnel.lat,
              });
            }
            setJobInfo(jobDetails);
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
        await fetchAccount(notes);
        await fetchAllData(notes);
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
  }, [idStore]);

  const resetHandler = () => {
    setShowAlert(false);
  };

  const cancelHandler = async () => {
    router.push({ pathname: "customer/calendar/cancel", params: { notes } });
  };

  const makePayment = async () => {
    try {
      router.push({
        pathname: "customer/calendar/payment/payment_QR",
        params: { notes },
      });
      // router.push("customer/calendar/payment");
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

  console.log(jobSeeker);
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
              Delivery Personnel
            </Text>
            <TextDisplay
              title={"Name"}
              content={personnelInfo.username ?? "To be confirmed"}
            />
            <TextDisplay
              title={"Contact number"}
              content={personnelInfo.number ?? "To be confirmed"}
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
                Your parcel has been delivered!
              </Text>
              <Text className={"font-RobotoRegular text-center mt-2"}>
                Please proceed to make payment for your delivery.
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

                <Marker
                  image={JobSeekerIcon}
                  className={"scale-50"}
                  coordinate={{
                    longitude: jobSeeker.long ?? 1,
                    latitude: jobSeeker.lat ?? 1,
                  }}
                />
              </MapView>
            </View>
          )}

          {/* DYNAMIC BUTTONS */}
          {serviceStatus === SERVICE_STATUS.PENDING ? (
            <View
              className={"flex flex-row"}
              style={{ justifyContent: "center", margin: 10 }}
            >
              <BaseButton
                secondary
                width="60%"
                title="Cancel Service"
                onPress={() => cancelHandler()}
              />
            </View>
          ) : serviceStatus === SERVICE_STATUS.DELIVERED ? (
            <View
              className={
                "flex flex-row space-x-4 items-center justify-center mt-4"
              }
            >
              <BaseButton
                primary
                width={200}
                title="Proceed to Payment"
                onPress={() => makePayment()}
              />
            </View>
          ) : serviceStatus === SERVICE_STATUS.PROGRESS ? (
            <View
              className={"flex flex-row space-x-4 items-center justify-center"}
            >
              <View
                className={
                  "border-primary border-2 px-4 py-2 bg-primary rounded-xl"
                }
              >
                <Text className={"text-white font-RobotoBold text-base"}>
                  You may track the progress here!
                </Text>
              </View>
            </View>
          ) : (
            <View
              className={"flex flex-row space-x-4 items-center justify-center"}
            >
              <View
                className={
                  "border-primary border-2 px-4 py-2 bg-primary rounded-xl"
                }
              >
                <Text className={"text-white font-RobotoBold text-base"}>
                  Delivery completed!
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default CustomerTrackerUI;
//         <View
//           className={"flex flex-column"}
//           style={{
//             justifyContent: "space-between",
//             borderWidth: 1,
//             borderRadius: 5,
//             margin: 10,
//             marginLeft: 40,
//             marginRight: 40,
//             marginTop: 20,
//             padding: 12,
//           }}
//         >
//           <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
//             Delivery Information
//           </Text>
//           <TextDisplay
//             title={"Collection"}
//             content={
//               serviceInfo.collectionDate + ", " + serviceInfo.collectionTime
//             }
//           />
//           <TextDisplay
//             title={"Delivery"}
//             content={serviceInfo.deliveryDate + ", " + serviceInfo.deliveryTime}
//           />
//
//           <TextDisplay title={"Service"} content={serviceInfo.serviceType} />
//         </View>
//
//         <View
//           className={"flex flex-column"}
//           style={{
//             justifyContent: "space-between",
//             borderWidth: 1,
//             borderRadius: 5,
//             margin: 10,
//             marginLeft: 40,
//             marginRight: 40,
//             marginTop: 15,
//             padding: 12,
//           }}
//         >
//           <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
//             Delivery Personnel
//           </Text>
//           <TextDisplay title={"Name"} content={personnelInfo.name} />
//           <TextDisplay
//             title={"Contact number"}
//             content={personnelInfo.contact}
//           />
//         </View>
//
//         <View
//           className={"flex flex-row"}
//           style={{ justifyContent: "center", borderWidth: 2, margin: 10 }}
//         >
//           <Image source={LandingIcon} />
//         </View>
//
//         <View
//           className={"flex flex-row"}
//           style={{ justifyContent: "center", margin: 20 }}
//         >
//           <BaseButton
//             secondary
//             width="60%"
//             title="Cancel Service"
//             onPress={() => cancelHandler()}
//           />
//         </View>
//       </View>
//     </ScrollView>
//   );
// };
//
// export default ScheduledTrackerUI;
