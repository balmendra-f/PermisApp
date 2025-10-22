import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { app, db } from "@/firebase";

export const getRequest = (callback: (data: any[]) => void) => {
  const auth = getAuth(app);

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (!user) return; 
    const q = query(
      collection(db, "solicitudes"),
      where("userId", "==", user.uid)
    );

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(results);
    });

    return () => unsubscribeSnapshot();
  });

  return () => unsubscribeAuth();
};
