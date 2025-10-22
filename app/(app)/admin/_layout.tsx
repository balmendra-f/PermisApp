import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

const AppLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }
  const options = { headerShown: false };
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={options} />
      <Stack.Screen name="request/page" options={options} />
    </Stack>
  );
};

export default AppLayout;
