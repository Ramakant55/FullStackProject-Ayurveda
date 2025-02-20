import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter({
  // ... your router config
}); 

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  next();
}); 