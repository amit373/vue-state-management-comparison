import { createRouter, createWebHistory } from 'vue-router';
import PostsList from '../views/PostsList.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'posts',
      component: PostsList,
    },
  ],
});

export default router;

