import { defineStore } from 'pinia'


export const useUserDataStore = defineStore('userData', {
    state: () => {
      return { 
        userProfileAvatar: '',
        userProfileName: '',
        isLoggedIn: false
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
      } 
    },
    getters: {
        getUserProfileAvatar: (state) => state.userProfileAvatar,
        getUserProfileName: (state) => state.userProfileName,
        getIsLoggedIn: (state) => state.isLoggedIn
    },

  
})