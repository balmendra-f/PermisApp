import { app, db } from "@/firebase";
import { getAuth } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const createRequest = async (solicitud: any) => {
  try {
    const auth = getAuth(app);
    const user = auth.currentUser;
    const userId = user?.uid;
    const docRef = await addDoc(collection(db, "solicitudes"), {
      tipoPermiso: solicitud.tipoPermiso,
      fechaInicio: solicitud.fechaInicio,
      fechaFin: solicitud.fechaFin,
      motivo: solicitud.motivo,
      documento: solicitud.documento,
      aproved: false,
      isPending: true,
      createdAt: serverTimestamp(),
      username: solicitud.username,
      section: solicitud.section,
      userId,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};
