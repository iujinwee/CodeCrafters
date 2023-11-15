import { Alert, Box, CloseIcon, HStack, IconButton, VStack } from "native-base";
import { Text } from "react-native";

const ErrorAlert = ({ title, message, shown, ...props }) => {
  return (
    shown && (
      <Alert className={"w-full h-full"} status="error">
        <VStack space={0.5} flexShrink={1} w="100%">
          <HStack
            flexShrink={1}
            space={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack flexShrink={1} space={4} alignItems="center">
              <Alert.Icon />
              <Text
                _dark={{
                  color: "coolGray.800",
                }}
                className={"font-RobotoMedium"}
              >
                {title ?? "Please try again!"}
              </Text>
            </HStack>
            <IconButton
              variant="unstyled"
              _focus={{
                borderWidth: 0,
              }}
              icon={<CloseIcon size="3" />}
              _icon={{
                color: "coolGray.600",
              }}
              {...props}
            />
          </HStack>
          {message && (
            <Box
              pl="8"
              _dark={{
                _text: {
                  color: "coolGray.600",
                },
              }}
            >
              <Text className={"font-RobotoRegular"}>{message}</Text>
            </Box>
          )}
        </VStack>
      </Alert>
    )
  );
};

export default ErrorAlert;
