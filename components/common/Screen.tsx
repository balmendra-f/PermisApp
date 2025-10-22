import { FC, ReactNode } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Screen: FC<{
  children: ReactNode;
  tabbed?: boolean;
  className?: string;
}> = ({ children, tabbed, className = "" }) => {
  const insets = useSafeAreaInsets();
  const shouldSetBottomInset = Platform.OS !== "android" && !tabbed;

  return (
    <View
      className={className}
      style={{
        flex: 1,
        paddingTop: Math.max(insets.top, 16),
        paddingBottom: shouldSetBottomInset ? Math.max(insets.bottom, 16) : 0,
        backgroundColor: "#171717",
      }}
    >
      <KeyboardAvoidingView
        enabled={Platform.OS === "ios"}
        behavior="height"
        style={{ flex: 1, paddingBottom: 2 }}
      >
        {children}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Screen;
