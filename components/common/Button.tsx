import { FC } from "react";
import { Pressable, Text } from "react-native";

interface ButtonProps {
  label: string;
  onPress: any;
  disabled?: boolean;
  buttonClassName?: string;
  textClassName?: string;
}

const Button: FC<ButtonProps> = ({
  label,
  onPress,
  disabled,
  buttonClassName,
  textClassName,
}) => {
  return (
    <Pressable
      className={`bg-indigo-700 p-4 rounded-lg items-center ${buttonClassName}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className={`text-white text-xl font-bold ${textClassName}`}>
        {label}
      </Text>
    </Pressable>
  );
};

export default Button;
