<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Hero from './components/Hero.vue'
import AboutMe from './components/AboutMe.vue'
import Logobar from './components/Logobar.vue'
import Footer from './components/Footer.vue'

const navbar = ref<HTMLElement | null>(null);

onMounted(() => {
  const appEl = document.querySelector('#app');
  const styleNavbar = () => {
    if (!appEl || !navbar.value) {
      return;
    }
    if (appEl.scrollTop > 0) {
      navbar.value.classList.add('scrolled');
    } else {
      navbar.value.classList.remove('scrolled');
    }
  }
  if (!appEl) {
    return;
  }
  appEl.addEventListener('scroll', styleNavbar);
  styleNavbar();
});

</script>

<template>
  <Hero />
  <AboutMe />
  <Logobar />
  <Footer />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
