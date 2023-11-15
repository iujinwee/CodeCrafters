import { Text, View, Image } from "react-native";
import React from "react";
import BaseButton from "@src/components/utils/button";
import paymentQR from "@src/assets/splash/QR_payment.png";
import { router } from "expo-router";

const PaymentQRUI = () => {
  const submitHandler = () => {
    router.push("customer/calendar/payment");
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
      <View className={`flex flex-column`} style={{ alignItems: "center" }}>
        <Image source={paymentQR} style={{ width: 200, height: 200 }} />
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
          Please make payment of $20.
        </Text>
        <View className={"w-2/3"}>
          <Text
            className={"font-RobotoRegular"}
            style={{
              fontSize: 15,
              marginTop: 15,
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            Please scan the above QR code through preferred vendor to make
            payment.
          </Text>
        </View>
        <BaseButton
          title="Payment Made"
          width="50%"
          onPress={() => submitHandler()}
        />
      </View>
    </View>
  );
};

export default PaymentQRUI;
