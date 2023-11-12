<script setup lang="ts">
import { ref, onMounted, createApp, h, inject } from 'vue';
import type { App as Application } from 'vue';
import Puzzle from './Puzzle.vue'

const getTransitionEndName = inject('getTransitionEndName') as () => string;
const feather = inject('feather');

const secondary = ref<HTMLElement | null>(null);

const showSecondaryTitle = () => {
  secondary.value?.classList.remove('hidden');
};

const mainHeaders = ref<HTMLElement | null>(null);
const puzzleContainer = ref<HTMLElement | null>(null);
const secretPuzzleContainer = ref<HTMLElement | null>(null);

let dynamicPuzzleApp: Application | null = null;
let secretDynamicPuzzleApp: Application | null = null;

const puzzleData = [{
  sideLength: 4,
  imageUrl: '/static/puzzle/headshot_square.jpg'
}, {
  sideLength: 5,
  imageUrl: '/static/puzzle/headshot_square.jpg'
}, {
  sideLength: 6,
  imageUrl: '/static/puzzle/headshot_square.jpg'
}, {
  sideLength: 8,
  imageUrl: '/static/puzzle/plsstahp.jpg'
}, {
  sideLength: 10,
  imageUrl: '/static/puzzle/finalcat.jpg',
  secretImageUrl: '/static/puzzle/finalwomen.jpg'
}];
let sideLengthIndex = 0;

const giveEmMoar = () => {
  if (dynamicPuzzleApp) {
    dynamicPuzzleApp.unmount();
  }
  if (secretDynamicPuzzleApp) {
    secretDynamicPuzzleApp.unmount();
  }
  sideLengthIndex = (sideLengthIndex + 1) % puzzleData.length;
  let selectedPuzzleData = puzzleData[sideLengthIndex];
  window.requestAnimationFrame(() => {
    if (mainHeaders.value && puzzleContainer.value && secretPuzzleContainer.value) {
      if (selectedPuzzleData.secretImageUrl) {
        mainHeaders.value?.classList.add('hidden');
        secretPuzzleContainer.value?.classList.remove('hidden');
        secretDynamicPuzzleApp = createApp({
          setup () {
            return () => {
              // @ts-ignore
              return h(Puzzle, {
                sideLength: selectedPuzzleData.sideLength,
                imageUrl: selectedPuzzleData.secretImageUrl ?? "",
                onWantsMoar: giveEmMoar
              });
            }
          }
        });
        secretDynamicPuzzleApp.provide('getTransitionEndName', getTransitionEndName);
        secretDynamicPuzzleApp.provide('feather', feather);
        secretDynamicPuzzleApp.mount(secretPuzzleContainer.value);
      } else {
        mainHeaders.value?.classList.remove('hidden');
        secretPuzzleContainer.value?.classList.add('hidden');
      }
      dynamicPuzzleApp = createApp({
        setup () {
          return () => {
            return h(Puzzle, {
              sideLength: selectedPuzzleData.sideLength,
              imageUrl: selectedPuzzleData.imageUrl,
              onWantsMoar: giveEmMoar
            });
          };
        }
      });
      dynamicPuzzleApp.provide('getTransitionEndName', getTransitionEndName);
      dynamicPuzzleApp.provide('feather', feather);
      dynamicPuzzleApp.mount(puzzleContainer.value);
    }
  });
};

</script>

<template>
  <section class="hero">
    <div ref="content" class="content">
      <div ref="mainHeaders" class="main-headers">
        <h1>Jacob Lee</h1>
        <h3>Software Architect</h3>
        <h3 ref="secondary" class="secondary-title hidden">&amp; Problem Solver</h3>
      </div>
      <div class="puzzle-container secret hidden" ref="secretPuzzleContainer">
      </div>
      <div class="puzzle-container" ref="puzzleContainer">
        <Puzzle ref="puzzle" imageUrl="/static/puzzle/headshot_square.jpg" @animationComplete="showSecondaryTitle" @wantsMoar="giveEmMoar"/>
      </div>
    </div>
  </section>
</template>

<style scoped>

.hero .content {
  display: flex;
  width: 100%;
  color: var(--color-white);
}

h3 {
  font-size: 2rem;
}

.main-headers {
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  bottom: 16px;
}

.secondary-title {
  transition: opacity 1s;
  opacity: 1;
}

.secondary-title.hidden {
  opacity: .1;
}

.puzzle-container {
  flex-basis: 50%;
  max-width: 480px;
  max-height: 480px;
}

.puzzle-container.hidden {
  display: none;
}

.main-headers.hidden {
  display: none;
}

@media (max-width: 960px) {
  .main-headers {
    bottom: 0;
  }
  .puzzle-container {
    padding: 24px;
    flex-basis: 55%;
    display: flex;
  }
  .puzzle-container.secret {
    margin-top: 0;
  }
}
</style>
