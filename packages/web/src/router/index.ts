import { createRouter, createWebHashHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import ErrorTrack from '../views/ErrorTrack.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/errors', component: ErrorTrack },
  ],
});

export default router;
