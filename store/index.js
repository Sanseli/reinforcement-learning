import Vuex from 'vuex';


const store = () => {
  return new Vuex.Store({
      state: {
        mqttMessage: ''
      },
      mutations: {
        setMqttMessage(state, data) {


          state.mqttMessage = data

          console.log(state.mqttMessage)
        },

      },
      getters: {
        getData: state => {
          return state.mqttData
        },
      }
  }
)};

export default store;
