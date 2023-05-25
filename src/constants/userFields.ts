import { useUserDataStore } from "../stores/userData";
import { getAuth } from "firebase/auth";

export default {
    setup() {
        // fields which will be created in collection when user registered
        const auth = getAuth()
        const userDataStore = useUserDataStore();
        const userFields = {
            userDisplayName: userDataStore.getUserProfileName,
            userEmail: userDataStore.getUserProfileEmail,
            userAvatar: auth.currentUser?.photoURL,
            gamesInCart: [],
            gamesInLibrary: [],
        };
        return { userFields };
    }
}

