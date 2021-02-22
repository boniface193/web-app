import Vue from "vue";
import Vuex from "vuex";
import onboarding from "./modules/onboarding";
import dashboard from "./modules/dashboard";
import inventory from "./modules/inventory";
import orders from "./modules/orders";
import sellers from "./modules/sellers";
import customer from "./modules/customer";
import settings from "./modules/settings";
import bankService from "./modules/bankService";

// initial state
const initialState = {
  onboarding: onboarding.state,
  dashboard: dashboard.state,
  inventory: inventory.state,
  orders: orders.state,
  sellers: sellers.state,
  customer: customer.state,
  settings: settings.state,
  bankService: bankService.state
}

//Convert object in string 
const COPY = JSON.stringify(initialState);

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    onboarding: onboarding,
    dashboard: dashboard,
    inventory: inventory,
    orders: orders,
    sellers: sellers,
    customer: customer,
    settings: settings,
    bankService: bankService
  },
  mutations: {
    reset(state) {
      //Convert string in object 
      let copyState = JSON.parse(COPY);
      Object.keys(state).forEach(key => {
        Object.assign(state[key], copyState[key]);
      })
    }
  }
});
