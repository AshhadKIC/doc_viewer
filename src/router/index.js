// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import UploadShow from '../components/UploadShow.vue';
import LandingPage from '../components/LandingPage.vue';

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/files/:name/:doc_type?',
    name: 'UploadShow',
    component: UploadShow
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: About
  // }
];

const router = createRouter({
  history: createWebHistory(),
  mode: 'hash',
  routes
});

export default router;
