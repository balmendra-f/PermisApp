import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";

const AppLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default AppLayout;
