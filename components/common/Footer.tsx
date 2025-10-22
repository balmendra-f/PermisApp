import { FC, ReactNode } from "react";
import { View } from "react-native";

interface ContentProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

const Footer: FC<ContentProps> = ({ children, className, padded = 10 }) => {
  return (
    <View
      className={className}
      style={{ paddingHorizontal: padded ? 10 : 0, backgroundColor: "black" }}
    >
      {children}
    </View>
  );
};

export default Footer;
