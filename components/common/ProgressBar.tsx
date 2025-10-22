import { View } from "react-native";

const ProgressBar = ({ percentage, color }:any) => (
  <View className="bg-gray-300 h-2" style={{ width: "100%" }}>
    <View
      className="bg-red-300 h-2"
      style={{ width: `${percentage}%`, backgroundColor: color }}
    />
  </View>
);

export default ProgressBar;
