import { useState } from "react";
import { Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker"; // Asegúrate de que esta importación esté así
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";

interface UploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

interface UseFileUploadReturn {
  uploading: boolean;
  progress: number;
  uploadedFile: UploadResult | null;
  pickDocument: () => Promise<void>;
  pickImage: () => Promise<void>;
  uploadFile: (
    uri: string,
    fileName: string,
    fileType: string
  ) => Promise<UploadResult | null>;
  resetUpload: () => void;
}

export const useFileUpload = (
  storagePath: string = "documentos"
): UseFileUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadResult | null>(null);

  // Función para seleccionar documento
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "image/*",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        await uploadFile(
          file.uri,
          file.name,
          file.mimeType || "application/octet-stream"
        );
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "No se pudo seleccionar el documento");
    }
  };

  // Función para seleccionar imagen
  const pickImage = async () => {
    try {
      // Solicitar permisos
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permiso Requerido",
          "Necesitamos permiso para acceder a tus fotos"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        //
        // AQUÍ ESTÁ LA CORRECCIÓN:
        //
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //
        //
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        // Es mejor usar el nombre de archivo original si está disponible, o crear uno único
        const uriParts = image.uri.split("/");
        const originalFileName = uriParts[uriParts.length - 1];
        const fileName =
          image.fileName || originalFileName || `image_${Date.now()}.jpg`;
        await uploadFile(image.uri, fileName, image.mimeType || "image/jpeg");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  // Función principal para subir archivo a Firebase
  const uploadFile = async (
    uri: string,
    fileName: string,
    fileType: string
  ): Promise<UploadResult | null> => {
    try {
      // Verificar autenticación
      const auth = getAuth();
      if (!auth.currentUser) {
        Alert.alert("Error", "Debes iniciar sesión para subir archivos");
        return null;
      }

      setUploading(true);
      setProgress(0);

      // Obtener el blob del archivo
      const response = await fetch(uri);
      const blob = await response.blob();

      // Crear referencia en Firebase Storage
      const storage = getStorage();
      const timestamp = Date.now();
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storageRef = ref(
        storage,
        `${storagePath}/${timestamp}_${sanitizedFileName}`
      );

      // Crear tarea de subida con progreso
      const uploadTask = uploadBytesResumable(storageRef, blob, {
        contentType: fileType,
      });

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Actualizar progreso
            const progressPercent =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(Math.round(progressPercent));
          },
          (error) => {
            // Manejar errores
            console.error("Upload error:", error);
            setUploading(false);
            Alert.alert(
              "Error",
              "No se pudo subir el archivo. Intenta de nuevo."
            );
            reject(error);
          },
          async () => {
            // Subida completada exitosamente
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

              const result: UploadResult = {
                url: downloadURL,
                fileName: sanitizedFileName,
                fileSize: uploadTask.snapshot.totalBytes,
                fileType: fileType,
              };

              setUploadedFile(result);
              setUploading(false);
              Alert.alert("Éxito", "Archivo subido correctamente");
              resolve(result);
            } catch (error) {
              console.error("Error getting download URL:", error);
              setUploading(false);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error("Error in uploadFile:", error);
      setUploading(false);
      Alert.alert("Error", "Ocurrió un error al procesar el archivo");
      return null;
    }
  };

  // Función para resetear el estado
  const resetUpload = () => {
    setUploading(false);
    setProgress(0);
    setUploadedFile(null);
  };

  return {
    uploading,
    progress,
    uploadedFile,
    pickDocument,
    pickImage,
    uploadFile,
    resetUpload,
  };
};