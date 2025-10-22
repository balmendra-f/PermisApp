import { useState, useEffect } from "react";
import * as Location from "expo-location";

const useCountry = () => {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCountryCode = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Se requiere permiso para acceder a la ubicación.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        setCountryCode(reverseGeocode[0].isoCountryCode || null);
      } else {
        setError("No se pudo determinar el código del país.");
      }
    } catch (err) {
      setError("Ocurrió un error al obtener la ubicación.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountryCode();
  }, []);

  return { countryCode, error, loading };
};

export default useCountry;
