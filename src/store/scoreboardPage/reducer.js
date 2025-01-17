import { FETCH_SCOREBOARD, POST_SCORE } from "./types";

const initialState = { scoreboards: [] };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SCOREBOARD:
      return { ...state, scoreboards: [...action.payload] };

    default: {
      return state;
    }
  }
}
