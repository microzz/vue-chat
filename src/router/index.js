import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login/Login.vue';
import Chatting from '../components/Chatting/Chatting.vue';
import AI from '../components/Chatting/AI.vue';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/chatting',
      name: 'Chatting',
      component: Chatting,
      // beforeEnter: (to, from, next) => {
      //   console.log('router', Math.random());
      //   next();
      // }
    },
    {
      path: '/AI',
      name: 'AI',
      component: AI,
    },
  ]
});

export default router;
