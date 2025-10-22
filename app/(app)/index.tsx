import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../providers/AuthProvider";
import { ActivityIndicator, View } from "react-native";

const Index = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user?.isAdmin) {
        router.replace("/admin");
      } else if (user) {
        router.replace("/(app)/(tabs)");
      } else {
        router.replace("/(auth)");
      }
    }
  }, [isLoading, user, router]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Index;
