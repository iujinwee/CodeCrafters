import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ACCOUNT_TYPE } from "@server/enum/AccountType";
import {
  Box,
  CheckIcon,
  FormControl,
  Select,
  WarningOutlineIcon,
} from "native-base";
import BaseInput from "@src/components/utils/inputbox";
import BaseButton from "@src/components/utils/button";
import loginIcon from "@src/assets/splash/LandingLogo.png";
import ErrorAlert from "@src/components/utils/erroralert";
import postLoginAccount from "@src/api/auth/postLoginAccount";
import * as SecureStore from "expo-secure-store";

const LoginUI = () => {
}

export default LoginUI;
