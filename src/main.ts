import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

const app = createApp(App)

app.provide('getTransitionEndName', ():string => {
  type TransitionsObject = {
    [index: string]: string;
  }
  const el = document.createElement('detector');
  const transitions: TransitionsObject = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  }
  for (let t in transitions) {
    // @ts-ignore
    if (el.style[t]) {
      return transitions[t];
    }
  }
  return 'transitionend';
});

app.provide('isInViewport', (el:HTMLElement, fullyVisible?:boolean):boolean => {
  const rect = el.getBoundingClientRect();
  const elBottom = fullyVisible ? rect.bottom : rect.bottom - rect.height;
  const elRight = fullyVisible ? rect.right : rect.right - rect.width;
  return rect.top >= 0 &&
    rect.left >= 0 &&
    elBottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    elRight <= (window.innerWidth || document.documentElement.clientWidth);
});

// @ts-ignore
app.provide('feather', feather);

app.mount('#app')
