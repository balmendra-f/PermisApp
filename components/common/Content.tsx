import { FC, ReactNode } from "react";
import { ScrollView, View } from "react-native";

interface ContentProps {
  children: ReactNode;
  centered?: boolean;
  padded?: boolean;
  scrollable?: boolean;
  opacity?: number;
}

const Content: FC<ContentProps> = ({
  children,
  centered,
  padded = 10,
  scrollable,
  opacity = 1,
}) => {
  const style: any = {
    flex: 1,
    backgroundColor: "black",
    justifyContent: centered ? "center" : "flex-start",
    padding: padded ? 10 : 0,
    opacity: opacity,
  };

  return (
    <View style={style}>
      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </View>
  );
};

export default Content;
