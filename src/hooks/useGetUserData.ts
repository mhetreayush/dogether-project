import { db } from "@/lib/firebase";
import { useUser } from "@/store/useUser";
import { doc, getDoc } from "firebase/firestore";

const useGetUserData = () => {
  const { user } = useUser();
  const getUserData = async () => {
    if (!user) return null;
    const userRef = doc(db, "userProfiles", user.uid);
    const docSnap = await getDoc(userRef);
    return docSnap.data();
  };

  return { getUserData };
};

export { useGetUserData };
