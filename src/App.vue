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
  feather.replace();
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

nav {
  background-color: var(--white);
  width: 100%;
  text-align: center;
  padding: 1rem 0;
  text-align: left;
  top: 0;
  position: sticky;
  z-index: 1;
}

nav.scrolled {
  border-bottom: 1px solid grey;
  box-shadow: var(--box-shadow);
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
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
