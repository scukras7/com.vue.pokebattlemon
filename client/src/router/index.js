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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
