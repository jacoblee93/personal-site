<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
const isInViewport = inject('isInViewport') as (el:HTMLElement, fullyVisible?:boolean) => boolean;

const logos = ref<HTMLElement[] | null>(null);
const logobar = ref<HTMLElement | null>(null);
const logoData = [{
  name: 'discord',
  logoUrl: '/static/wordmarks/discord.png',
  linkUrl: 'https://discord.com/'
}, {
  name: 'bushards',
  logoUrl: '/static/wordmarks/bushards.svg',
  linkUrl: 'https://bushardspharmacy.com/'
}, {
  name: 'webflow',
  logoUrl: '/static/wordmarks/webflow.png',
  linkUrl: 'https://webflow.com/'
}, {
  name: 'slack',
  logoUrl: '/static/wordmarks/slack.png',
  linkUrl: 'https://slack.com/fund/'
}, {
  name: 'lastfrontiermedia',
  logoUrl: '/static/wordmarks/last-frontier-media.svg',
  linkUrl: 'https://www.lastfrontiermedia.com/'
}, {
  name: 'backbone',
  logoUrl: '/static/wordmarks/backbone.png',
  linkUrl: 'https://playbackbone.com/'
}, {
  name: 'shopify',
  logoUrl: '/static/wordmarks/shopify.png',
  linkUrl: 'https://shopify.com/'
}, {
  name: 'thehill',
  logoUrl: '/static/wordmarks/thehill.png',
  linkUrl: 'https://thehill.com/'
}, {
  name: 'stripe',
  logoUrl: '/static/wordmarks/stripe.png',
  linkUrl: 'https://stripe.com/'
}, {
  name: 'kotn',
  logoUrl: '/static/wordmarks/kotn.png',
  linkUrl: 'https://kotn.com/'
}, {
  name: 'blueyard',
  logoUrl: '/static/wordmarks/blueyard.svg',
  linkUrl: 'https://blueyard.com/',
  imgClasses: 'blueyard'
}];

onMounted(() => {
  const appEl = document.querySelector('#app');
  if (!appEl) {
    return;
  }
  const activateLogobar = () => {
    if (!logobar.value || !isInViewport(logobar.value)) {
      return;
    }
    window.requestAnimationFrame(() => {
      if (!logos.value) {
        return;
      }
      for (let i = 0; i < logos.value.length; i++) {
        logos.value[i].classList.add('active');
      }
      appEl.removeEventListener('scroll', activateLogobar);
    });
  }
  appEl.addEventListener('scroll', activateLogobar);
  activateLogobar();
});

</script>

<template>
  <div class="logobar" ref="logobar">
    <h4 class="description">Past investors, partners, and customers include:</h4>
    <div class="logo-overflow-wrapper">
      <div class="logos" ref="logos" v-for="i in 2" :key="i">
        <a v-for="logo in logoData" :key="logo.name" :href="logo.linkUrl" target="_blank">
          <img class="logo" :class="logo.imgClasses" :src="logo.logoUrl" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>

.logobar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px 0;
  background-color: var(--color-white);
}

.description {
  margin-bottom: 4px;
}

.logo-overflow-wrapper {
  display: flex;
  width: 100%;
  overflow: hidden;
}

.logo-overflow-wrapper:hover .logos {
  animation-play-state: paused;
}

.logos {
  display: flex;
  justify-content: flex-start;
  overflow: visible;
}

.logos.active {
  animation: logoinfinitescroll 45s linear infinite;
}

.logo {
  height: 48px;
  margin: 16px 24px;
}

.logo.blueyard {
  background-color: #0236f2;
  margin: 16px;
}

@keyframes logoinfinitescroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@media (max-width: 960px) {
  .logo {
    height: 32px;
    margin: 16px 16px;
  }
  .logo-overflow-wrapper:hover .logos {
    animation-play-state: running;
  }
}

</style>
