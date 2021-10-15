interface State {
  playingSound: boolean;
}

const initialState: State = {
  playingSound: false,
};

const state = initialState;

export const getState = (): State => state;

export const setPlayingState = (status: boolean): void => {
  state.playingSound = status;
};
