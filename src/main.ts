import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

const app = createApp(App)

app.provide('isInViewport', (el:HTMLElement, fullyVisible:boolean = false):boolean => {
  const rect = el.getBoundingClientRect();
  const elBottom = fullyVisible ? rect.bottom : rect.bottom - rect.height;
  const elRight = fullyVisible ? rect.right : rect.right - rect.width;
  return rect.top >= 0 &&
    rect.left >= 0 &&
    elBottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    elRight <= (window.innerWidth || document.documentElement.clientWidth);
});

app.mount('#app')
