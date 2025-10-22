import React, { useState } from "react";
import { View, Text, ScrollView, Switch, TouchableOpacity } from "react-native";
import Screen from "@/components/common/Screen";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

const Settings = () => {
  const logout = async () => {
    await signOut(auth);
  };
  const [notifications, setNotifications] = useState(true);

  return (
    <Screen>
      <ScrollView
        className="flex-1 bg-neutral-900 px-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center mt-2 mb-6">
          <Text className="text-2xl font-bold text-[#F1F5F9]">
            Configuración
          </Text>
        </View>

        <SettingsSection title="Cuenta">
          <SettingItem
            title="Perfil"
            subtitle="Edita tu información personal"
            onPress={() => {}}
          />
          <SettingItem
            title="Seguridad"
            subtitle="Contraseña y autenticación"
            onPress={() => {}}
          />
          <SettingItem
            title="Privacidad"
            subtitle="Controla quién puede ver tu contenido"
            onPress={() => {}}
          />
        </SettingsSection>

        <SettingsSection title="Preferencias">
          <SettingItem
            title="Notificaciones"
            subtitle="Gestiona tus alertas"
            onPress={() => {}}
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#475569", true: "#6366F1" }}
                thumbColor="#F1F5F9"
              />
            }
          />

          <SettingItem title="Idioma" subtitle="Español" onPress={() => {}} />
        </SettingsSection>

        <SettingsSection title="Soporte">
          <SettingItem
            title="Ayuda"
            subtitle="Preguntas frecuentes y soporte"
            onPress={() => {}}
          />
          <SettingItem
            title="Acerca de"
            subtitle="Versión 1.0.0"
            onPress={() => {}}
          />
        </SettingsSection>

        <TouchableOpacity
          onPress={logout}
          className="flex-row items-center justify-center bg-indigo-700 py-4 rounded-xl mt-2 mb-6 active:opacity-80"
        >
          <Text className="text-[#F1F5F9] text-base font-medium ml-2">
            Cerrar sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
};
const SettingItem = ({ title, subtitle, onPress, rightElement }: any) => {
  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-4 border-b border-neutral-700 active:opacity-70"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-1">
        <Text className="text-base font-medium text-[#F1F5F9] mb-1">
          {title}
        </Text>
        {subtitle && <Text className="text-sm text-[#94A3B8]">{subtitle}</Text>}
      </View>
      {rightElement && <View className="ml-2">{rightElement}</View>}
    </TouchableOpacity>
  );
};

const SettingsSection = ({ title, children }: any) => (
  <View className="mb-6">
    <Text className="text-base font-semibold text-indigo-600 mb-3 pl-2">
      {title}
    </Text>
    <View className="bg-neutral-800 rounded-xl overflow-hidden">
      {children}
    </View>
  </View>
);

export default Settings;
