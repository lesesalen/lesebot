const initialState = {
  playingSound: false,
};
const state = initialState;
export const getState = () => state;
export const setPlayingState = (status) => {
  state.playingSound = status;
};
