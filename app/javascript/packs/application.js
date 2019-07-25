/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import SearchBox from "./components/SearchBox.vue";

Vue.use(VueRouter);

const routes = [{ path: "/search/:id", component: SearchBox }, { path: "/", component: SearchBox }];

const router = new VueRouter({
  mode: "history",
  routes
});

document.addEventListener("DOMContentLoaded", () => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount("#app");
});
