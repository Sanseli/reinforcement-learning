import Vuex from 'vuex';

const store = () => {
  return new Vuex.Store({
      state: {
        mqttData: []
      },
      mutations: {
        increment (state, data) {
            state.mqttData.push(data);
        },

      },
      getters: {
        getData: state => {
          return state.mqttData
        },
      },
  }
)};

export default store;
