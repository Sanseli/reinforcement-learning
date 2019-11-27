import Vuex from 'vuex';

const store = () => {
  return new Vuex.Store({
      state: {
          message: ''
      },
      mutations: {
        increment(state, data) {
          state.message = data
          console.log(state)
        },

        test(state, data) {
          state.message = data
        }

      },
      getters: {
        getMessage: state => {
          return state.message
        }
      },
  }
)};

export default store;
