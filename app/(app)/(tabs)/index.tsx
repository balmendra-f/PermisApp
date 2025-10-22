import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { useRequests } from "@/providers/RequestProvider";

const PermissionsScreen = () => {
  const { user } = useAuth();
  const username = user?.name;
  const { requests } = useRequests();
  const pendientes = requests.filter((r: any) => r.isPending).length;
  const aprobados = requests.filter((r: any) => !r.isPending).length;

  const renderItem = ({ item }: { item: any }) => {
    const fechaInicio = item.fechaInicio?.toDate
      ? item.fechaInicio.toDate()
      : new Date(item.fechaInicio);
    const fechaFin = item.fechaFin?.toDate
      ? item.fechaFin.toDate()
      : new Date(item.fechaFin);

    const fechaFormateada = `${fechaInicio.getDate()} ${fechaInicio.toLocaleString(
      "es-ES",
      { month: "short" }
    )} - ${fechaFin.getDate()} ${fechaFin.toLocaleString("es-ES", {
      month: "short",
    })}`;

    return (
      <View className="bg-neutral-800 p-5 rounded-lg mt-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-white">
            {item.tipoPermiso}
          </Text>
          <View
            className={`px-3 py-1 rounded-full ${
              item.isPending ? "bg-yellow-500" : "bg-green-500"
            }`}
          >
            <Text className="text-white text-xs">
              {item.isPending ? "Pendiente" : "Aprobado"}
            </Text>
          </View>
        </View>

        <Text className="text-gray-400 mt-1">{item.motivo}</Text>

        <View className="flex-row items-center mt-3">
          <Ionicons name="calendar-outline" size={16} color="gray" />
          <Text className="text-gray-400 ml-2">{fechaFormateada}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="p-4 flex-1">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-white">Mis Permisos</Text>
            <Text className="text-base text-gray-400">
              Bienvenido, {username}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-around mt-5">
          <View className="bg-neutral-800 p-5 rounded-lg items-center w-[48%]">
            <Text className="text-white">Pendientes</Text>
            <Text className="text-4xl font-bold text-blue-500">
              {pendientes}
            </Text>
          </View>
          <View className="bg-neutral-800 p-5 rounded-lg items-center w-[48%]">
            <Text className="text-white">Aprobados</Text>
            <Text className="text-4xl font-bold text-blue-500">
              {aprobados}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-blue-600 p-4 rounded-lg flex-row justify-center items-center mt-5"
          onPress={() => router.push("/(app)/request/page")}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text className="text-white text-base font-bold ml-3">
            Nueva Solicitud
          </Text>
        </TouchableOpacity>

        <View className="mt-5">
          <Text className="text-xl font-bold text-white">Mis Solicitudes</Text>
          <Text className="text-sm text-gray-400">
            Historial de permisos solicitados
          </Text>
        </View>

        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default PermissionsScreen;
