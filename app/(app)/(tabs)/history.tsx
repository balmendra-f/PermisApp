import { useAuth } from "@/providers/AuthProvider";
import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LeaveBalanceScreen = () => {
  const { user } = useAuth();
  const leaveData = {
    vacations: {
      available: user?.vacationsInDays,
      used: user?.vacationUsedInDays,
    },
    adminDays: user?.administrativeDays,
    timeReturns: user?.timeReturnsInHours,
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-4">
        <Text className="text-2xl font-bold text-white mb-5">
          Resumen de Días
        </Text>
        <View className="bg-neutral-800 p-5 rounded-lg mb-4">
          <Text className="text-white text-lg mb-2">Vacaciones</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-gray-400">Utilizadas</Text>
              <Text className="text-blue-500 text-4xl font-bold mt-2">
                {leaveData.vacations.used}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-400">Disponibles</Text>
              <Text className="text-blue-500 text-4xl font-bold mt-2">
                {leaveData.vacations.available}
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-neutral-800 p-5 rounded-lg mb-4">
          <Text className="text-white text-lg">
            Días Administrativos Disponibles
          </Text>
          <Text className="text-blue-500 text-4xl font-bold mt-2">
            {leaveData.adminDays} días
          </Text>
        </View>

        <View className="bg-neutral-800 p-5 rounded-lg">
          <Text className="text-white text-lg">Devoluciones de Tiempo</Text>
          <Text className="text-blue-500 text-4xl font-bold mt-2">
            {leaveData.timeReturns} horas
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LeaveBalanceScreen;
