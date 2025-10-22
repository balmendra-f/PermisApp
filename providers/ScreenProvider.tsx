import { createContext, FC, ReactNode, useContext, useState } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  Platform,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const initialContext = {
  isLoading: false,
  setIsLoading: () => {},
};

interface Context {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ScreenContext = createContext<Context>(initialContext);

const ScreenProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const isAndroid = Platform.OS === "android";

  return (
    <View
      style={[
        styles.container,
        isAndroid && {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <ScreenContext.Provider value={{ isLoading, setIsLoading }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={isAndroid ? "black" : "transparent"}
          translucent={!isAndroid}
        />
        <LoadingDim isLoading={isLoading} />
        {children}
      </ScreenContext.Provider>
    </View>
  );
};

const LoadingDim: FC<{ isLoading: boolean }> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

function useScreen() {
  return useContext(ScreenContext);
}

export { useScreen };
export default ScreenProvider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  loadingContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    opacity: 0.6,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "white",
    marginTop: 10,
  },
});
