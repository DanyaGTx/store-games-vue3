export type GENRES = {
  games_count: number;
  id: number;
  image_background: string;
  name: string;
  slug: string;
};

export type ESRB_RATING = {
  id: number;
  name: string;
  slug: string;
};

export type ADDED_BY_STATUS = {
  beaten: number;
  dropped: number;
  owned: number;
  playing: number;
  toplay: number;
  yet: number;
};

export type DEVELOEPRS = {
  name: string;
};

export type SCREENSHOT = {
  height: number;
  width: number;
  id: number;
  image: string;
};

export interface GAME_DETAILS {
  added: number;
  added_by_status: ADDED_BY_STATUS;
  background_image: string;
  clip: null;
  dominant_color: string;
  esrb_rating: ESRB_RATING[];
  genres: GENRES[];
  id: number;
  description: string;
  name: string;
  released: string;
  developers: DEVELOEPRS[];
  rating: string;
  stores: {
    store: {
      name: string;
    };
  }[];
}

export interface GAME {
  name: string;
  id: number;
  website: string,
  released: string,
  rating: number;
  background_image: string;
  isDeleting: boolean;
}

export type CREATOR = {
  id: number;
  name: string;
  image: string;
  games_count: number;
  positions: {
    id: number;
    name: string;
  }[];
  games: {
    name: string;
    id: number;
  }[];
};

export interface LOGIN {
  email: string;
  password: string;
}

export interface REGISTER {
  email: string;
  password: string;
}
