import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import './assets/tailwind.css';
import axiosInstance from './utils/axios-interceptor';
import { useToast } from './composables/useToast';

const app = createApp(App);

// Make axios instance available globally
app.config.globalProperties.$axios = axiosInstance;

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err);
  console.error('Vue component:', vm);
  console.error('Error info:', info);
  
  const { showToast } = useToast();
  showToast('An unexpected error occurred', 'error');
};

app.use(router);
app.mount('#app'); 