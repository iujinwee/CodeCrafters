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
import { TouchableOpacity } from "react-native-gesture-handler";

const LoginUI = () => {
  const [accountInfo, setAccountInfo] = useState({
    type: "",
    username: "",
    password: "",
  });
  const [invalidInput, setInvalidInput] = useState({
    type: false,
    username: false,
    password: false,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const [isSecureEntry, setisSecureEntry] = useState(true);

  const inputHandler = (input, field) => {
    setAccountInfo((prevState) => ({ ...prevState, [field]: input }));
    setShowAlert(false);
  };

  const invalidHandler = (bool, field) => {
    setInvalidInput((prevState) => ({ ...prevState, [field]: bool }));
  };

  const resetHandler = () => {
    setShowAlert(false);
  };

  const isValidInput = () => {
    const validType = accountInfo.type !== "";
    const validUsername = accountInfo.username !== "";
    const validPassword = accountInfo.password !== "";

    return validType && validUsername && validPassword;
  };

  const submitHandler = async () => {
    invalidHandler(!accountInfo.username, "username");
    invalidHandler(!accountInfo.password, "password");
    invalidHandler(!accountInfo.type, "type");

    if (isValidInput()) {
      try {
        await postLoginAccount(accountInfo).then(async (json) => {
          console.log("Calling API to login");
          const validResponse = json !== null ? !!json.success : false;
          if (validResponse) {
            try {
              await SecureStore.setItemAsync("accountId", json.body._id);
              // console.log(await SecureStore.getItemAsync("account"));
              router.push(
                json.body.type === ACCOUNT_TYPE.CUSTOMER
                  ? "/customer/home"
                  : "/jobseeker/home"
              );
            } catch (e) {
              setErrorMessage("Failed to set User session");
            }
          } else {
            setErrorMessage(json.body);
            setShowAlert(true);
          }
        });
      } catch (e) {
        setErrorMessage("Error calling API Endpoint!");
      }
    } else {
      setShowAlert(true);
    }
  };

  return (
    <View className={"flex h-full w-full items-center"}>
      {showAlert && (
        <View className={"absolute z-10 w-3/4"}>
          <ErrorAlert
            title={"Please try again!"}
            message={errorMessage ?? "You have missing or invalid inputs!"}
            onPress={() => resetHandler()}
            shown={showAlert}
          />
        </View>
      )}

      <View className={"mt-28 scale-110 items-center"}>
        <Image source={loginIcon} width={150} height={150} />
        <Text className={"font-RobotoBold text-2xl text-primary mt-5"}>
          MoveInLo!
        </Text>
      </View>

      <View className={"flex flex-row mt-10"}>
        <View className={"border-r-2 flex items-center"}>
          <Text className="font-RobotoBold text-xl my-2 w-40 text-center">
            Login
          </Text>
          <View className={"w-28 border-b-4 border-primary"} />
        </View>
        <View>
          <Pressable
            onPress={() => {
              router.push("/auth/signup");
            }}
          >
            <Text className="font-RobotoBold text-xl my-2 w-40 text-center">
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>

      <View className={"mt-8 w-3/4"}>
        <Text className={"font-RobotoMedium"}>Account Type</Text>
        <FormControl className={"w-1/2"}>
          <Select
            selectedValue={accountInfo.type}
            accessibilityLabel={"Select"}
            placeholder={"Select"}
            onValueChange={(itemValue) => inputHandler(itemValue, "type")}
            _selectedItem={{
              endIcon: <CheckIcon size="3" />,
            }}
          >
            <Select.Item label={"Customer"} value={ACCOUNT_TYPE.CUSTOMER} />
            <Select.Item label={"Job Seeker"} value={ACCOUNT_TYPE.JOBSEEKER} />
          </Select>
        </FormControl>
        <Box
          className={"flex flex-row space-x-2 mt-0 mb-2"}
          style={{
            display: showAlert && invalidInput.type === "" ? "" : "none",
          }}
        >
          <View className={"mt-0.5 ml-1"}>
            <WarningOutlineIcon size="xs" color={"red.500"} />
          </View>
          <Text className={"text-red-600"}>Please make a selection!</Text>
        </Box>

        <View>
          <BaseInput
            title={"Username"}
            defaultValue={accountInfo.username.trim()}
            placeholder={"Enter your username"}
            onChangeText={(email) => inputHandler(email, "username")}
          />

          <View className={"flex flex-row items-center space-y-5 space-x-1 "}>
            <View className={"w-5/6"}>
              <BaseInput
                title={"Password"}
                secureTextEntry={isSecureEntry}
                defaultValue={accountInfo.password}
                placeholder={"Enter your password"}
                onChangeText={(password) => inputHandler(password, "password")}
                icon={
                  <TouchableOpacity
                    onPress={() => {
                      setisSecureEntry((prev) => !prev);
                    }}
                  ></TouchableOpacity>
                }
              />
            </View>

            <Pressable
              onPress={() => {
                setisSecureEntry(!isSecureEntry);
              }}
              className={
                "w-14 h-8 justify-center items-center bg-primary border-primary border-2 rounded-lg"
              }
            >
              <Text className={"font-RobotoBold text-white"}>
                {isSecureEntry ? "Show" : "Hide"}
              </Text>
            </Pressable>
          </View>
        </View>

        <View
          className={
            "flex flex-row justify-center space-x-28 mt-2 items-center"
          }
        >
          <View>
            <Pressable
              onPress={() => {
                router.push("/auth/forgetpassword");
              }}
            >
              <Text className={"font-RobotoBold text-primary"}>
                Forget Password
              </Text>
            </Pressable>
          </View>
          <View className={"flex"}>
            <BaseButton
              primary
              title={"Login"}
              onPress={submitHandler}
              width={105}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginUI;
