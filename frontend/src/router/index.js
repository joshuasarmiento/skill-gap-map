import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AnalyticsView from '../views/AnalyticsView.vue';
import AboutView from '../views/AboutView.vue'; // Add this

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/analytics', name: 'analytics', component: AnalyticsView },
    { path: '/about', name: 'about', component: AboutView } // Add this
  ]
});

export default router;