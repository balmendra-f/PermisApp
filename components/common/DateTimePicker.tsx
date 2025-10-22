import { FC, useEffect, useState } from "react";
import { Button, Text, View, Platform, TouchableOpacity } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import * as Localization from "expo-localization";

// Mapa de locales de date-fns soportados
const supportedLocales: Record<string, Locale> = { es, en: enUS };

const getLocale = (): Locale => {
  const languageCode = Localization.getLocales()[0]?.languageCode;

  if (languageCode && supportedLocales[languageCode]) {
    return supportedLocales[languageCode];
  }

  return enUS;
};

const DateTimePicker: FC<{
  disable?: boolean;
  externalOpen?: boolean;
  setExternalOpen?: (open: boolean) => void;
  mode: "date" | "time";
  disableButtons?: boolean;
  onDateChange?: (date: Date) => void;
  value: Date | undefined | null;
  androidTextColor?: string;
  customDateFormat?: string;
}> = ({
  disable,
  mode,
  externalOpen = false,
  setExternalOpen,
  disableButtons,
  onDateChange,
  value,
  androidTextColor = "text-white",
  customDateFormat,
}) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());

  const onChange = (_: any, date?: Date) => {
    // En Android, el picker se cierra automáticamente
    if (Platform.OS === "android") {
      setShow(false);
      setExternalOpen?.(false);
    }

    // Si se seleccionó una fecha
    if (date) {
      setSelectedDate(date);
      onDateChange?.(date);
    }
  };

  useEffect(() => {
    setShow(externalOpen);
  }, [externalOpen]);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
    }
  }, [value]);

  const changeByDate = (delta: number) => {
    const time = selectedDate.getTime();
    const newDate = new Date(time + delta * 24 * 60 * 60 * 1000);
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  const dateFormat = customDateFormat || getDateFormat(mode);
  const formattedDate = format(selectedDate, dateFormat, {
    locale: getLocale(),
  });

  const handlePress = () => {
    if (!disable) {
      setShow(true);
      setExternalOpen?.(true);
    }
  };

  return (
    <View className="flex items-center space-y-4 flex-1">
      {!disableButtons && mode === "date" && (
        <Button
          title="Prev"
          onPress={() => changeByDate(-1)}
          disabled={disable}
        />
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        className="flex items-center flex-1"
        disabled={disable}
      >
        {Platform.OS === "android" ? (
          <>
            <Text className={`${androidTextColor} text-base`}>
              {formattedDate}
            </Text>
            {show && (
              <RNDateTimePicker
                disabled={disable}
                value={selectedDate}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
              />
            )}
          </>
        ) : (
          <RNDateTimePicker
            disabled={disable}
            value={selectedDate}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            themeVariant="dark"
            accentColor="#1976D2"
          />
        )}
      </TouchableOpacity>

      {!disableButtons && mode === "date" && (
        <Button
          title="Next"
          onPress={() => changeByDate(1)}
          disabled={disable}
        />
      )}
    </View>
  );
};

const getDateFormat = (mode: string) => {
  if (mode === "date") {
    return "d MMMM yyyy"; // Corregido: era "yYYY"
  } else if (mode === "time") {
    return "HH:mm";
  } else {
    return "d MMMM yyyy";
  }
};

export default DateTimePicker;
