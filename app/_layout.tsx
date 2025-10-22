import "../global.css";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ScreenProvider from "../providers/ScreenProvider";
import AuthProvider from "@/providers/AuthProvider";
import { RequestsProvider } from "@/providers/RequestProvider";

const RootLayout = () => (
  <SafeAreaProvider>
    <AuthProvider>
      <ScreenProvider>
        <RequestsProvider>
          <Slot />
        </RequestsProvider>
      </ScreenProvider>
    </AuthProvider>
  </SafeAreaProvider>
);

export default RootLayout;
