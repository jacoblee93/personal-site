<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Puzzle from './Puzzle.vue'

const secondary = ref<HTMLElement | null>(null);

const showSecondaryTitle = () => {
  secondary.value?.classList.remove('hidden');
};

</script>

<template>
  <section class="hero">
    <div class="content">
      <div class="main-headers">
        <h1>Jacob Lee</h1>
        <h3>Fractional CTO</h3>
        <h3 ref="secondary" class="secondary-title hidden">&amp; Problem Solver</h3>
      </div>
      <Puzzle imageUrl="/src/assets/static/headshot_square.jpg" @animationComplete="showSecondaryTitle" />
    </div>
  </section>
</template>

<style scoped>

.hero .content {
  display: flex;
  width: 100%;
  color: var(--white);
}

h3 {
  font-size: 2rem;
}

.main-headers {
  display: flex;
  flex-direction: column;
  position: relative;
  bottom: 16px;
}

.secondary-title {
  transition: opacity 1s;
  opacity: 1;
}

.secondary-title.hidden {
  opacity: 0;
}

@media (max-width: 960px) {
  .main-headers {
    bottom: 0;
  }
}
</style>
