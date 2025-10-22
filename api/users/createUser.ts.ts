import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const createUser = async (
  uid: string,
  userData: {
    section: any;
    name: string;
    email: string;
    country: string | null;
  }
) => {
  const db = getFirestore();
  try {
    await setDoc(doc(db, "users", uid), {
      name: userData.name,
      email: userData.email,
      createdAt: serverTimestamp(),
      country: userData.country,
      vacationsInDays: 15,
      vacationUsedInDays: 1,
      administrativeDays: 5,
      timeReturnsInHours: 8,
      isAdmin: false,
      section: userData.section,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default createUser;
