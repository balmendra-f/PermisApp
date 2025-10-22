"use client";

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRequests } from "@/providers/RequestProvider";

interface Solicitud {
  id: string;
  userId: string;
  username?: string;
  tipoPermiso: string;
  motivo: string;
  fechaInicio: any;
  fechaFin: any;
  isPending: boolean;
  aproved: boolean;
  createdAt: any;
  updatedAt?: any;
  documento: any;
  
}

type FilterType = "todas" | "aprobadas" | "rechazadas";

export default function HistorialSolicitudes() {
  const { requests, loading } = useRequests();
  console.log(requests);
  const [filtroActivo, setFiltroActivo] = useState<FilterType>("todas");

  const solicitudesProcesadas = requests.filter(
    (req: Solicitud) => !req.isPending
  );

  const solicitudesFiltradas = solicitudesProcesadas.filter(
    (req: Solicitud) => {
      if (filtroActivo === "aprobadas") return req.aproved === true;
      if (filtroActivo === "rechazadas") return req.aproved === false;
      return true;
    }
  );

  const solicitudesOrdenadas = [...solicitudesFiltradas].sort((a, b) => {
    const dateA =
      a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
    const dateB =
      b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
    return dateB - dateA;
  });

  const formatDate = (dateObj: any) => {
    if (!dateObj) return "";
    const date = dateObj.toDate ? dateObj.toDate() : dateObj;
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateObj: any) => {
    if (!dateObj) return "";
    const date = dateObj.toDate ? dateObj.toDate() : dateObj;
    return date.toLocaleString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const contadorAprobadas = solicitudesProcesadas.filter(
    (req) => req.aproved
  ).length;
  const contadorRechazadas = solicitudesProcesadas.filter(
    (req) => !req.aproved
  ).length;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center gap-4">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-gray-400 text-base">Cargando historial...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center p-5 bg-gray-800">
          <View className="flex-row items-center gap-3">
            <View className="w-15 h-15 rounded-lg bg-blue-600 justify-center items-center">
              <Ionicons name="time-outline" size={32} color="#FFF" />
            </View>
            <View>
              <Text className="text-white text-2xl font-bold">Historial</Text>
              <Text className="text-gray-400 text-base mt-1">
                Solicitudes procesadas
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="filter-list" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Estadísticas */}
        <View className="flex-row px-5 py-4 gap-3">
          <View className="flex-1 bg-gray-800 p-4 rounded-xl items-center gap-2">
            <Ionicons name="checkmark-circle" size={32} color="#10B981" />
            <Text className="text-white text-2xl font-bold">
              {contadorAprobadas}
            </Text>
            <Text className="text-gray-400 text-xs">Aprobadas</Text>
          </View>

          <View className="flex-1 bg-gray-800 p-4 rounded-xl items-center gap-2">
            <Ionicons name="close-circle" size={32} color="#EF4444" />
            <Text className="text-white text-2xl font-bold">
              {contadorRechazadas}
            </Text>
            <Text className="text-gray-400 text-xs">Rechazadas</Text>
          </View>

          <View className="flex-1 bg-gray-800 p-4 rounded-xl items-center gap-2">
            <Ionicons name="document-text" size={32} color="#3B82F6" />
            <Text className="text-white text-2xl font-bold">
              {solicitudesProcesadas.length}
            </Text>
            <Text className="text-gray-400 text-xs">Total</Text>
          </View>
        </View>

        {/* Filtros */}
        <View className="flex-row px-5 gap-2 mb-5">
          {(["todas", "aprobadas", "rechazadas"] as FilterType[]).map(
            (filtro) => (
              <TouchableOpacity
                key={filtro}
                className={`flex-1 py-2 px-4 rounded-lg border-2 items-center ${
                  filtroActivo === filtro
                    ? "border-blue-500 bg-blue-100/20"
                    : "border-transparent bg-gray-800"
                }`}
                onPress={() => setFiltroActivo(filtro)}
              >
                <Text
                  className={`text-sm font-semibold ${
                    filtroActivo === filtro ? "text-blue-500" : "text-gray-400"
                  }`}
                >
                  {filtro.charAt(0).toUpperCase() + filtro.slice(1)}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Lista de Solicitudes */}
        <View className="px-5 pt-0">
          <Text className="text-gray-400 text-sm mb-4">
            {solicitudesOrdenadas.length} solicitud(es)
          </Text>

          {solicitudesOrdenadas.length === 0 ? (
            <View className="items-center justify-center py-14 gap-3">
              <Ionicons name="folder-open-outline" size={64} color="#9CA3AF" />
              <Text className="text-white text-lg font-bold">
                No hay solicitudes
              </Text>
              <Text className="text-gray-400 text-center text-sm">
                {filtroActivo === "aprobadas" && "No hay solicitudes aprobadas"}
                {filtroActivo === "rechazadas" &&
                  "No hay solicitudes rechazadas"}
                {filtroActivo === "todas" && "El historial está vacío"}
              </Text>
            </View>
          ) : (
            solicitudesOrdenadas.map((solicitud) => (
              <View
                key={solicitud.id}
                className="bg-gray-800 p-5 rounded-2xl mb-4 shadow-md"
              >
                {/* Header con estado */}
                <View className="flex-row justify-between items-center mb-3">
                  <View
                    className="flex-row items-center px-3 py-1 rounded-full gap-2"
                    style={{
                      backgroundColor: solicitud.aproved
                        ? "#10B98120"
                        : "#EF444420",
                    }}
                  >
                    <Ionicons
                      name={
                        solicitud.aproved ? "checkmark-circle" : "close-circle"
                      }
                      size={16}
                      color={solicitud.aproved ? "#10B981" : "#EF4444"}
                    />
                    <Text
                      className="text-sm font-semibold"
                      style={{
                        color: solicitud.aproved ? "#10B981" : "#EF4444",
                      }}
                    >
                      {solicitud.aproved ? "Aprobada" : "Rechazada"}
                    </Text>
                  </View>
                  {solicitud.updatedAt && (
                    <Text className="text-xs text-gray-400">
                      {formatDateTime(solicitud.updatedAt)}
                    </Text>
                  )}
                </View>

                {/* Información del usuario */}
                <Text className="text-white text-lg font-bold mb-3">
                  {solicitud.username || "Sin nombre"}
                </Text>

                {/* Badge de tipo */}
                <View
                  className="self-start px-3 py-1 rounded mb-3"
                  style={{
                    backgroundColor: getTipoColor(solicitud.tipoPermiso),
                  }}
                >
                  <Text className="text-white text-sm font-semibold">
                    {solicitud.tipoPermiso}
                  </Text>
                </View>

                {/* Descripción */}
                <Text className="text-gray-400 text-base mb-3">
                  {solicitud.motivo}
                </Text>

                {/* Fechas */}
                <View className="flex-row items-center gap-2 mb-2">
                  <Ionicons name="calendar-outline" size={18} color="#757575" />
                  <Text className="text-gray-400 text-sm">
                    {formatDate(solicitud.fechaInicio)} -{" "}
                    {formatDate(solicitud.fechaFin)}
                  </Text>
                </View>

                {/* Fecha de creación */}
                <View className="flex-row items-center gap-1">
                  <Ionicons name="time-outline" size={14} color="#6B7280" />
                  <Text className="text-gray-400 text-xs">
                    Solicitado: {formatDateTime(solicitud.createdAt)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
