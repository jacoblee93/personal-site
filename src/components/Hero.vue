<script setup lang="ts">
import { ref, onMounted, createApp, h, inject } from 'vue';
import Puzzle from './Puzzle.vue'

const getTransitionEndName = inject('getTransitionEndName');
const feather = inject('feather');

const secondary = ref<HTMLElement | null>(null);

const showSecondaryTitle = () => {
  secondary.value?.classList.remove('hidden');
};

const mainHeaders = ref<HTMLElement | null>(null);
const puzzleContainer = ref<HTMLElement | null>(null);
const secretPuzzleContainer = ref<HTMLElement | null>(null);

let dynamicPuzzleApp = null;
let secretDynamicPuzzleApp = null;

const puzzleData = [{
  sideLength: 4,
  imageUrl: '/src/assets/static/puzzle/headshot_square.jpg'
}, {
  sideLength: 5,
  imageUrl: '/src/assets/static/puzzle/headshot_square.jpg'
}, {
  sideLength: 6,
  imageUrl: '/src/assets/static/puzzle/headshot_square.jpg'
}, {
  sideLength: 8,
  imageUrl: '/src/assets/static/puzzle/plsstahp.jpg'
}, {
  sideLength: 12,
  imageUrl: '/src/assets/static/puzzle/finalcat.jpg',
  secretImageUrl: '/src/assets/static/puzzle/finalwomen.jpg'
}];
let sideLengthIndex = 0;

const giveEmMoar = () => {
  if (mainHeaders.value && puzzleContainer.value && secretPuzzleContainer.value) {
    if (dynamicPuzzleApp) {
      dynamicPuzzleApp.unmount();
    }
    if (secretDynamicPuzzleApp) {
      secretDynamicPuzzleApp.unmount();
    }
    sideLengthIndex = (sideLengthIndex + 1) % puzzleData.length;
    let selectedPuzzleData = puzzleData[sideLengthIndex];
    window.requestAnimationFrame(() => {
      if (selectedPuzzleData.secretImageUrl) {
        mainHeaders.value?.classList.add('hidden');
        secretPuzzleContainer.value?.classList.remove('hidden');
        secretDynamicPuzzleApp = createApp({
          setup () {
            return () => {
              return h(Puzzle, {
                sideLength: selectedPuzzleData.sideLength,
                imageUrl: selectedPuzzleData.secretImageUrl,
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
    });
  }
};

</script>

<template>
  <section class="hero">
    <div ref="content" class="content">
      <div ref="mainHeaders" class="main-headers">
        <h1>Jacob Lee</h1>
        <h3>Fractional CTO</h3>
        <h3 ref="secondary" class="secondary-title hidden">&amp; Problem Solver</h3>
      </div>
      <div class="puzzle-container secret hidden" ref="secretPuzzleContainer">
      </div>
      <div class="puzzle-container" ref="puzzleContainer">
        <Puzzle ref="puzzle" imageUrl="/src/assets/static/puzzle/headshot_square.jpg" @animationComplete="showSecondaryTitle" @wantsMoar="giveEmMoar"/>
      </div>
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
  opacity: 0;
}

.puzzle-container {
  width: 480px;
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
    width: unset;
    flex-basis: 55%;
    display: flex;
    align-items: flex-end;
  }
  .puzzle-container.secret {
    margin-top: 0;
  }
}
</style>
