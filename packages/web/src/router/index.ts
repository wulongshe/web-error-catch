import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import ErrorTrack from '../views/ErrorTrack.vue';
import Login from '../views/Login.vue';
import { getToken, setToken, setCurrentUser } from '../utils/auth.js';
import type { User } from '../types/index.js';

// 必须在 createWebHistory() 之前执行：
// createWebHistory() 初始化时会立刻快照 window.location，之后再 replaceState 无效
function consumeOAuthParams() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const userRaw = params.get('user');
  if (!token || !userRaw) return;
  try {
    setToken(token);
    setCurrentUser(JSON.parse(userRaw) as User);
  } catch {
    // ignore
  }
  history.replaceState(null, '', window.location.pathname);
}

consumeOAuthParams();

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/errors', component: ErrorTrack, meta: { requiresAuth: true } },
    { path: '/login', component: Login, meta: { layout: 'blank' } },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !getToken()) return '/login';
  if (to.path === '/login' && getToken()) return '/dashboard';
});

export default router;
