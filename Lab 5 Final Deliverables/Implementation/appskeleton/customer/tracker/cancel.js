import React, { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import { router } from "expo-router";
import { Modal } from "native-base";
import QuestionIcon from "@src/assets/splash/QuestionIcon.png";
import BaseButton from "@src/components/utils/button";
import postWithdrawService from "@src/api/service/postWithdrawService";
import ErrorAlert from "@src/components/utils/erroralert";
import * as SecureStore from "expo-secure-store";

const CancelServiceUI = () => {
  
};

export default CancelServiceUI;
