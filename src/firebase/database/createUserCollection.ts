import { collection, doc, setDoc } from "firebase/firestore";
import { useUserDataStore } from "../../stores/userData";
import { db } from "../../firebase/firebase";
import userFields from "../../constants/userFields";
import { getAuth } from "firebase/auth";
const createUserCollection = async () => {
  const userDataStore = useUserDataStore();
  const usersRef = collection(db, "users");
  const auth = getAuth()
  if(auth.currentUser?.email) {
    await setDoc(
        doc(usersRef, auth.currentUser?.email),
        userFields.setup().userFields
      );
  }

};

export default createUserCollection;
