import {
  TouchableOpacity,
  Text,
  View,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { FC, Fragment } from "react";
import { Ionicons } from "@expo/vector-icons";


const ImagePicker: FC<{
  imageUrl: string | null;
  isUploading: boolean;
  pickImage: () => void;
  setImageUrl: Function;
}> = ({ imageUrl, isUploading, pickImage, setImageUrl }) => {
  return (
    <Fragment>
      <TouchableOpacity
        onPress={pickImage}
        className="w-20 h-20 bg-gray-200 rounded-lg justify-center items-center mx-4 mb-6 mt-2 relative"
      >
        {imageUrl ? (
          <View className="w-full h-full">
            <Image
              source={{ uri: imageUrl }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
            {isUploading && (
              <View className="absolute top-0 left-0 w-full h-full bg-black/50 justify-center items-center rounded-lg">
                <ActivityIndicator size="large" color="white" />
              </View>
            )}
            <Pressable
              onPress={() => setImageUrl(null)}
              className="absolute top-0 right-0 bg-black/50 rounded-full p-1"
            >
              <Ionicons name="close" size={18} color="white" />
            </Pressable>
          </View>
        ) : (
          <Ionicons name="camera" size={30} color="gray" />
        )}
      </TouchableOpacity>
    </Fragment>
  );
};

export default ImagePicker;
