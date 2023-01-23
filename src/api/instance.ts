import axios from 'axios'

const API_KEY = import.meta.env.VITE_GAMES_APP_KEY

const apiRoot = axios.create({
  baseURL: 'https://api.rawg.io/api',
  params: {
    key: API_KEY,
  },
})

export { apiRoot }
