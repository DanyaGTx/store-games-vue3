import { defineStore } from 'pinia'


export const useUserDataStore = defineStore('userData', {
    state: () => {
      return { 
        userProfileAvatar: ''
      }
    },

    actions: {
      setUserProfileAvatar(url: string) {
        this.userProfileAvatar = url
      },
    },
    getters: {
        getUserProfileAvatar: (state) => state.userProfileAvatar
    }
})