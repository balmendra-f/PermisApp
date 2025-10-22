import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  Alert,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useScreen } from "@/providers/ScreenProvider";
import { auth } from "@/firebase";
import Screen from "@/components/common/Screen";

export default function LoginScreen() {
  const { setIsLoading } = useScreen();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const goToForgot = () => router.push("/(auth)/forgot");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
  };

  const onSubmit = async () => {
    setError(false);
    const password = formData.password;

    if (password.trim().length < 6) {
      setError(true);
      setErrorMessage("Ingresa una contraseña de al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    Keyboard.dismiss();

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, formData.email, password);
      router.push("/(app)/(tabs)");
    } catch (error) {
      Alert.alert("Error", "Contraseña inválida", [{ text: "OK" }], {
        cancelable: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 p-6 justify-center">
        <View className="items-center mb-16">
          <Image
            source={require("../../assets/images/icon.png")}
            className="h-40 w-40 mt-20 rounded-full"
            resizeMode="contain"
          />
        </View>
        <Text className="text-3xl font-bold text-white text-center mb-2">
          Bienvenido a Permiso Salud
        </Text>
        <Text className="text-base text-gray-400 text-center mb-8">
          Permisos rápidos, cero papel.
        </Text>

        <View className="mb-6">
          <TextInput
            className="bg-neutral-800 rounded-xl p-4 mb-4 text-white text-base"
            placeholder="Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            autoCapitalize="none"
          />
          <TextInput
            className="bg-neutral-800 rounded-xl p-4 mb-2 text-white text-base"
            placeholder="Password"
            placeholderTextColor="#666"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            autoCapitalize="none"
            secureTextEntry={true}
          />
          <TouchableOpacity onPress={goToForgot} className="self-end">
            <Text className="text-gray-400 text-sm">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onSubmit}
          className="bg-indigo-700 rounded-xl p-4 items-center mb-4"
        >
          <Text className="text-white text-base font-semibold">Sign In</Text>
        </TouchableOpacity>
        <View className="flex-row justify-center items-center">
          <Text className="text-gray-400 text-sm">Don't Have An Account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signUp")}>
            <Text className="text-indigo-500 text-sm font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
