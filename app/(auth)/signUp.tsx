import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Keyboard,
  Image,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase";
import createUser from "@/api/users/createUser.ts";
import useCountry from "@/hooks/useCountry";
import { useScreen } from "@/providers/ScreenProvider";
import Header from "@/components/common/Header";
import Screen from "@/components/common/Screen";
import useImageUpload from "@/hooks/useImageUpload";
import ImagePicker from "@/components/common/ImagePicker";

const SignUp = () => {
  const { imageUrl, isUploading, setImageUrl, pickImage } = useImageUpload();
  const { setIsLoading } = useScreen();
  const { countryCode } = useCountry();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    password2: "",
    country: countryCode,
    section: "",
  });

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      country: countryCode,
    }));
  }, [countryCode, imageUrl]);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSectionChange = (value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/[^0-9]/g, "");
    setFormData((prevState) => ({
      ...prevState,
      section: numericValue,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError(true);
      setErrorMessage("Please enter an email");
      return false;
    }
    if (!formData.name.trim()) {
      setError(true);
      setErrorMessage("Please enter your name");
      return false;
    }
    if (!formData.section.trim()) {
      setError(true);
      setErrorMessage("Please enter your section");
      return false;
    }
    if (formData.password.length < 6) {
      setError(true);
      setErrorMessage("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.password2) {
      setError(true);
      setErrorMessage("Passwords do not match");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    setError(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const { uid } = userCredential.user;
      await createUser(uid, {
        name: formData.name,
        email: formData.email,
        country: formData.country,
        section: formData.section,
      });
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/(app)/(tabs)");
    } catch (error: any) {
      setError(true);
      setErrorMessage(
        error.code === "auth/email-already-in-use"
          ? "Email already in use"
          : "Error creating account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormIncomplete =
    !formData.email.trim() ||
    !formData.name.trim() ||
    !formData.section.trim() ||
    formData.password.length < 6 ||
    formData.password !== formData.password2;

  return (
    <Screen>
      <Header title="Create Account" />
      <View className="flex-1 p-6">
        <Text className="text-3xl font-bold text-white text-center mb-2">
          Create Account
        </Text>
        <Text className="text-base text-gray-400 text-center mb-8">
          Please fill in your details
        </Text>

        <View className="space-y-4">
          <View className="mt-4">
            <TextInput
              className="bg-neutral-800 rounded-xl p-4 text-white text-base"
              placeholder="Email"
              placeholderTextColor="#666"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View className="mt-4">
            <TextInput
              className="bg-neutral-800 rounded-xl p-4 text-white text-base"
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              autoCapitalize="words"
            />
          </View>

          <View className="mt-4">
            <TextInput
              className="bg-neutral-800 rounded-xl p-4 text-white text-base"
              placeholder="Sección (Solo numeros)"
              placeholderTextColor="#666"
              value={formData.section}
              onChangeText={handleSectionChange}
              keyboardType="numeric"
              autoCapitalize="none"
            />
          </View>

          <View className="mt-4">
            <TextInput
              className="bg-neutral-800 rounded-xl p-4 text-white text-base"
              placeholder="Password"
              placeholderTextColor="#666"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View className="mt-4">
            <TextInput
              className="bg-neutral-800 rounded-xl p-4 text-white text-base"
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              value={formData.password2}
              onChangeText={(value) => handleInputChange("password2", value)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {error && (
            <Text className="text-red-500 text-sm text-center">
              {errorMessage}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={onSubmit}
          disabled={isFormIncomplete || isUploading}
          className={`rounded-xl p-4 items-center mt-6 mb-4 ${
            isFormIncomplete || isUploading ? "bg-gray-600" : "bg-indigo-700"
          }`}
        >
          <Text className="text-white text-base font-semibold">
            {isUploading ? "Uploading Image..." : "Create Account"}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center items-center">
          <Text className="text-gray-400 text-sm">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)")}>
            <Text className="text-indigo-500 text-sm font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};

export default SignUp;
