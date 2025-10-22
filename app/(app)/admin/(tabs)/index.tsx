"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRequests } from "@/providers/RequestProvider";
import { updateRequestById } from "@/api/request/updateById";
import { useAuth } from "@/providers/AuthProvider";

interface Solicitud {
  id: string;
  userId: string;
  section: string;
  tipoPermiso: string;
  motivo: string;
  fechaInicio: any;
  fechaFin: any;
  isPending: boolean;
  aproved: boolean;
  createdAt: any;
  documento: any;
  username: string;
}

export default function PanelAdmin() {
  const { requests, loading, fetchBySection } = useRequests();
  const { user } = useAuth();
  const section = user.section;
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = fetchBySection(section);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [section]);

  const solicitudesPendientes = requests.filter(
    (req: Solicitud) => req.isPending && req.section === section
  );

  const formatDate = (dateObj: any) => {
    if (!dateObj) return "";
    if (dateObj.toDate)
      return dateObj.toDate().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    if (dateObj instanceof Date)
      return dateObj.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    return "";
  };

  const getTipoColor = (tipo: string) => {
    const colores: { [key: string]: string } = {
      Vacaciones: "#1E88E5",
      "Permiso Personal": "#9C27B0",
      "Licencia Médica": "#43A047",
      "Día Libre": "#FB8C00",
    };
    return colores[tipo] || "#757575";
  };

  const handleAprobar = async (id: string) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(id));
      await updateRequestById(id, { isPending: false, aproved: true });
      Alert.alert(
        "Solicitud Aprobada",
        "La solicitud ha sido aprobada exitosamente",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error al aprobar solicitud:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al aprobar la solicitud. Intenta nuevamente.",
        [{ text: "OK" }]
      );
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleRechazar = async (id: string) => {
    Alert.alert(
      "Rechazar Solicitud",
      "¿Estás seguro de que deseas rechazar esta solicitud?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Rechazar",
          style: "destructive",
          onPress: async () => {
            try {
              setProcessingIds((prev) => new Set(prev).add(id));
              await updateRequestById(id, { isPending: false, aproved: false });
              Alert.alert(
                "Solicitud Rechazada",
                "La solicitud ha sido rechazada",
                [{ text: "OK" }]
              );
            } catch (error) {
              console.error("Error al rechazar solicitud:", error);
              Alert.alert(
                "Error",
                "Hubo un problema al rechazar la solicitud. Intenta nuevamente.",
                [{ text: "OK" }]
              );
            } finally {
              setProcessingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
              });
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center gap-4">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-400 text-base">
            Cargando solicitudes...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView className="flex-1">
        <View className="flex-row justify-between items-center p-5 bg-gray-800">
          <View className="flex-row items-center gap-3">
            <View className="w-15 h-15 rounded-lg bg-blue-600 justify-center items-center">
              <Ionicons name="shield-outline" size={32} color="#FFF" />
            </View>
            <View>
              <Text className="text-white text-2xl font-bold">
                Panel Administrador
              </Text>
              <Text className="text-gray-400 text-base mt-1">{user?.name}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="logout" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View className="bg-gray-800 m-5 p-6 rounded-2xl shadow-md">
          <Text className="text-white text-base mb-3">
            Solicitudes Pendientes
          </Text>
          <Text className="text-blue-500 text-5xl font-bold">
            {solicitudesPendientes.length}
          </Text>
        </View>

        <View className="px-5 pt-0">
          <Text className="text-white text-2xl font-bold mb-1">
            Solicitudes por Aprobar
          </Text>
          <Text className="text-gray-400 text-sm mb-5">
            Revisa y gestiona las solicitudes
          </Text>

          {solicitudesPendientes.length === 0 ? (
            <View className="items-center justify-center py-10">
              <Ionicons
                name="checkmark-circle-outline"
                size={48}
                color="#9CA3AF"
              />
              <Text className="text-gray-400 text-base mt-3">
                No hay solicitudes pendientes
              </Text>
            </View>
          ) : (
            solicitudesPendientes.map((solicitud: Solicitud) => {
              const isProcessing = processingIds.has(solicitud.id);
              const badgeColor = getTipoColor(solicitud.tipoPermiso);

              return (
                <View
                  key={solicitud.id}
                  className="bg-gray-800 p-5 rounded-2xl mb-4 shadow-md"
                >
                  <Text className="text-white text-xl font-bold mb-3">
                    Usuario: {solicitud.username}
                  </Text>

                  <View
                    className="self-start px-3 py-1 rounded mb-3"
                    style={{ backgroundColor: badgeColor }}
                  >
                    <Text className="text-white text-sm font-semibold">
                      {solicitud.tipoPermiso}
                    </Text>
                  </View>

                  <Text className="text-gray-400 text-base mb-3">
                    {solicitud.motivo}
                  </Text>

                  <View className="flex-row items-center gap-2 mb-5">
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#757575"
                    />
                    <Text className="text-gray-400 text-sm">
                      {formatDate(solicitud.fechaInicio)} -{" "}
                      {formatDate(solicitud.fechaFin)}
                    </Text>
                  </View>

                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded border-2 border-red-700 bg-gray-900 ${
                        isProcessing ? "opacity-60" : ""
                      }`}
                      onPress={() => handleRechazar(solicitud.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <ActivityIndicator size="small" color="#D32F2F" />
                      ) : (
                        <>
                          <Ionicons
                            name="close-circle-outline"
                            size={20}
                            color="#EF4444"
                          />
                          <Text className="text-red-500 text-base font-semibold">
                            Rechazar
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded bg-blue-600 ${
                        isProcessing ? "opacity-60" : ""
                      }`}
                      onPress={() => handleAprobar(solicitud.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={20}
                            color="#FFF"
                          />
                          <Text className="text-white text-base font-semibold">
                            Aprobar
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
