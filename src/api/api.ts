import games from './services/games'

import { apiRoot } from './instance.js'

const api = {
    games: games(apiRoot),
}
export { api }
