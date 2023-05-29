import { defineStore } from 'pinia'
import { collection, doc, setDoc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth } from "firebase/auth";
import { useToast } from "vue-toastification";
import { toastOptions } from "../toast/toastOptions";
const auth = getAuth()
const toast = useToast();
export const useFavoriteGames = defineStore('favoriteGames', {
    state: () => {
      return { 
        favoriteGamesIds: [] as number[],
      }
    },

    actions: {
        async setFavoriteGames(newFavoriteGames: number[]) {         
          if (auth.currentUser?.email) {
              this.favoriteGamesIds.push(...newFavoriteGames)
              const usersRef = collection(db, "users");
              await updateDoc(doc(usersRef, auth.currentUser.email), {
                gamesInLibrary: this.favoriteGamesIds,
              });
            } else {
              toast("You must be logged in", toastOptions);
            }
        },

        async getFavoriteGamesFromDB() {
          if (auth.currentUser?.email) {
            const usersRef = collection(db, "users");
            const docRef = doc(usersRef, auth.currentUser.email);
            const favoriteGames = await getDoc(docRef);
            if (favoriteGames.exists()) {
              this.favoriteGamesIds = favoriteGames.data().gamesInLibrary
            } else {
              console.log('favoriteGames do not exist')
            }
          }
        },

        async deleteGameFromLibrary(id: number) {
          if(auth.currentUser?.email) {
            this.favoriteGamesIds = this.favoriteGamesIds.filter((gameId) => gameId !== id)
            const usersRef = collection(db, "users");
            await updateDoc(doc(usersRef, auth.currentUser.email), {gamesInLibrary: this.favoriteGamesIds},)
           } else {
            toast("You must be logged in", toastOptions);
          }
        },

    },
    getters: {
        getFavoriteIds: (state) => state.favoriteGamesIds
    }
})
