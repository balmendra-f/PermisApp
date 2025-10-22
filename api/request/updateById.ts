import { db } from "@/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export const updateRequestById = async (id: string, updates: any) => {
  try {
    const docRef = doc(db, "solicitudes", id);
    const updatedData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updatedData);

    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};
