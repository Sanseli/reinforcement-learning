import Vuex from 'vuex';

const store = () => {
  return new Vuex.Store({
    state: {
      gridWorldData: null,
      slidingPuzzleData: null
    },
    mutations: {
      setGridWorldData(state, data) {
        state.gridWorldData = data;
      },
      setSlidingPuzzleData(state, data) {
        state.slidingPuzzleData = data;
      }
    }
  })
};

export default store;
