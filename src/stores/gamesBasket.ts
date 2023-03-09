import { defineStore } from 'pinia'
import { api } from "../api/api";

import { getAuth } from "firebase/auth";

import { useToast } from "vue-toastification";
import { toastOptions } from "../toast/toastOptions";

import { collection, doc, setDoc, getDoc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase/firebase";
// const userDataStore = useUserDataStore();

const toast = useToast();

const auth = getAuth()

export const useGamesStoreBasket = defineStore('gamesBasket', {
    state: () => {
      return { 
        gamesBasket: [] as GAME[] 
      }
    },
    actions: {
      async addGame(id: number) {
        const { data } = await api.games.getGameById(id);

      
        console.log(data);

        const newGame = {
          id: data.id,
          name: data.name,
          rating: data.rating
        }
        if(auth.currentUser?.email) {
          this.gamesBasket.push(newGame)

          // add games to firebase database
            const usersRef = collection(db, "users");
            await setDoc(doc(usersRef, auth.currentUser.email), {  
                email: auth.currentUser.email,
                name: auth.currentUser.displayName,
                avatar: auth.currentUser.photoURL,
                gamesInCart: [...this.gamesBasket],
            });
          
        } else {
          toast("You must be logged in", toastOptions);
        }
      },
      async deleteGame(id: number) {
        if(auth.currentUser?.email) {
          this.gamesBasket = this.gamesBasket.filter((game) => game.id !== id)
          
          const usersRef = collection(db, "users");
          await setDoc(doc(usersRef, auth.currentUser.email), {  
              gamesInCart: [...this.gamesBasket],
          });

         } else {
          toast("You must be logged in", toastOptions);
        }
        
      },

      async setGamesInCart() {
        if(auth.currentUser?.email) {
          const docRef = doc(db, "users", auth.currentUser.email);
          const docSnap = await getDoc(docRef);
  
          console.log('DATABASE', docSnap.data());
          if (docSnap.exists()) {  
            this.gamesBasket = docSnap.data().gamesInCart
          } else {
            console.log("No such document!");
          }
        }
      }
    },
    getters: {
      getAllGamesInCart: (state) => state.gamesBasket
    }
  })

  interface GAME {
    name: string;
    id: number;
    rating: number;
    background_image?: string;
  }