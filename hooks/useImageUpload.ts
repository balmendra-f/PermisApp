import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Alert } from "react-native";
import { storage } from "../firebase";

export default function useImageUpload() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUrl(uri);
      await uploadImage(uri); 
    }
  };

  const uploadImage = async (uri: string) => {
    if (!uri) return null;
    
    try {
      setIsUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const imageName = `images/${Date.now()}.jpg`;
      const storageRef = ref(storage, imageName);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setImageUrl(downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error al subir imagen:", error);
      Alert.alert("Error", "Hubo un problema al subir la imagen.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { imageUrl, isUploading, pickImage, uploadImage, setImageUrl };
}
