import games from './services/games'

import { apiRoot } from './instance.js'
import creators from './services/creators'

const api = {
    games: games(apiRoot),
    creators: creators(apiRoot)
}
export { api }
