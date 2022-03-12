import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../views/Landing'
import Simulator from '../views/Simulator'
import GameOver from '../views/GameOver'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing,
  },
  {
    path: '/battle',
    name: 'Simulator',
    component: Simulator
  },
  {
    path: '/gameover',
    name: 'GameOver',
    component: GameOver,
    props: true
  }
  // {
  //  path: '/about',
  //  name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  //  component() {
  //    return import(/* webpackChunkName: "about" */ '../views/About.vue');
  //  },
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
