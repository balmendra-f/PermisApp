import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const getUserById = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id };
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getUserById;
