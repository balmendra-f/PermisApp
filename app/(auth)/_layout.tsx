import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={baseOptions} />
      <Stack.Screen name="signUp" options={baseOptions} />
      <Stack.Screen name="forgot" options={baseOptions} />
    </Stack>
  );
}

const baseOptions = { headerShown: false };
