import Vuex from 'vuex';

const store = () => {
  return new Vuex.Store({
    state: {
      gridWorldData: null,
      slidingPuzzleData: null,
      qTableData: null
    },
    mutations: {
      setGridWorldData(state, data) {
        state.gridWorldData = data;
      },
      setSlidingPuzzleData(state, data) {
        state.slidingPuzzleData = data;
      },
      setQTableData(state, data) {
        state.qTableData = data;
      }
    }
  })
};

export default store;
