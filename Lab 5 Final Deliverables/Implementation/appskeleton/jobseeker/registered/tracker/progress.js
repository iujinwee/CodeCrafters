import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Modal } from "native-base";
import { SERVICE_STATUS } from "@server/enum/ServiceStatus";
import BaseButton from "@src/components/utils/button";
import LandingIcon from "@src/assets/splash/LandingLogo.png";
import TextDisplay from "@src/components/utils/textdisplay";
import ErrorAlert from "@src/components/utils/erroralert";
import getServiceInfo from "@src/api/service/getServiceInfo";
import getUserInfo from "@src/api/auth/getUserInfo";
import getJobProgress from "@src/api/progress/getJobProgress";
import putUpdateCollection from "@src/api/progress/putUpdateCollection";
import putUpdateDelivered from "@src/api/progress/putUpdateDelivered";
import putUpdatePaid from "@src/api/progress/putUpdatePaid";

const JobSeekerTrackerUI = () => {
  
};

export default JobSeekerTrackerUI;
