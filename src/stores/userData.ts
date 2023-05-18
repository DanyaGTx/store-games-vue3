import { defineStore } from 'pinia'


export const useUserDataStore = defineStore('userData', {
    state: () => {
      return { 
        userEmail: '',
        userProfileAvatar: '',
        userProfileName: '',
        isLoggedIn: false,
      }
    },

    actions: {
      setUserProfileAvatar(url: string) {
        this.userProfileAvatar = url
      },
      setUserProfileName(name: string) {
        this.userProfileName = name
      },
      setIsLoggedInUser(value: boolean) {
        this.isLoggedIn = value
      },
      setUserEmail(email: string) {
        this.userEmail = email
      } 
      
    },
    getters: {
        getUserProfileAvatar: (state) => state.userProfileAvatar,
        getUserProfileName: (state) => state.userProfileName,
        getUserProfileEmail: (state) => state.userEmail,
        getIsLoggedIn: (state) => state.isLoggedIn,
    },

  
})