import { FC, Fragment } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

const Header: FC<{
  title?: string;
  renderCenter?: any;
  renderRight?: any;
  canGoBack?: boolean;
}> = ({ title, renderCenter, renderRight, canGoBack = true }) => {
  return (
    <Fragment>
      <StatusBar style="light" />
      <View className="flex flex-row items-center p-4 bg-black ">
        <View className="flex-1">
          {canGoBack && (
            <Ionicons
              name="chevron-back"
              size={24}
              color="white"
              onPress={router.back}
            />
          )}
        </View>
        <Text className="text-white text-xl font-bold ml-4">
          {renderCenter ? renderCenter() : title}
        </Text>
        <View className="flex-1">{renderRight?.()}</View>
      </View>
    </Fragment>
  );
};

export default Header;
