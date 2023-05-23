import { useUserDataStore } from "../stores/userData";
import { useGamesStoreBasket } from "../stores/gamesBasket";
import { useFavoriteGames } from "../stores/favoriteGames";
import { getAuth } from "firebase/auth";

export default {
    setup() {
        const auth = getAuth()
        const userDataStore = useUserDataStore();
        const gamesBasket = useGamesStoreBasket();
        const favoriteGames = useFavoriteGames();
        const userFields = {
            userDisplayName: userDataStore.getUserProfileName,
            userEmail: userDataStore.getUserProfileEmail,
            userAvatar: auth.currentUser?.photoURL,
            gamesInCart: gamesBasket.getAllGamesInCart,
            gamesInLibrary: favoriteGames.favoriteGamesIds,
        };

        return { userFields };
    }
}

