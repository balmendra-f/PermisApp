import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

export const getRequestsBySection = (
  section: string,
  callback: (data: any[]) => void
) => {
  const q = query(
    collection(db, "solicitudes"),
    where("section", "==", section)
  );

  const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(results);
  });

  return () => unsubscribeSnapshot();
};
