<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
const getTransitionEndName = inject('getTransitionEndName') as () => string;

const props = defineProps<{
  sideLength: number,
  index: number,
  isEmptySpace: boolean
}>();

let startX = props.index % props.sideLength;
let startY = Math.floor(props.index / props.sideLength);
let currentX = startX;
let currentY = startY;

let animationEnabled = false;

const puzzlePiece = ref<HTMLInputElement | null>(null);
const pieceImage = ref<HTMLInputElement | null>(null);

const setDataURL = async (dataURL:string) => {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(() => {
      if (!pieceImage.value) {
        return reject(new Error(`No image in DOM`));
      }
      pieceImage.value.src = dataURL;
      pieceImage.value?.addEventListener('load', (e) => {
        window.requestAnimationFrame(() => {
          if (!puzzlePiece.value) {
            return reject(new Error(`No image in DOM`));
          }
          if (!props.isEmptySpace) {
            puzzlePiece.value.style.visibility = 'visible';
          }
          return resolve(null);
        });
      }, { once: true });
      pieceImage.value?.addEventListener('error', reject, { once: true });
    });
  });
};

const setPosition = async (x:number, y:number):Promise<{x:number, y:number}> => {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(() => {
      if (!puzzlePiece.value) {
        return;
      }
      currentX = x;
      currentY = y;
      let xDiff = currentX - startX;
      let yDiff = currentY - startY;
      let hasResolved = false;
      puzzlePiece.value.style.transform = `translate3d(${xDiff * 100}%, ${yDiff * 100}%, 0)`;
      if (animationEnabled) {
        puzzlePiece.value.addEventListener(getTransitionEndName(), (e) => {
          if (hasResolved) {
            return;
          }
          hasResolved = true;
          resolve({
            x: currentX,
            y: currentY
          });
        }, {
          once: true
        });
        setTimeout(() => {
          if (!hasResolved) {
            return resolve({
              x: currentX,
              y: currentY
            });
          }
        }, 1000);
      } else {
        return resolve({
          x: currentX,
          y: currentY
        });
      }
    });
  });
};

const slide = async (direction:string) => {
  if (direction === 'left') {
    if (currentX <= 0) {
      return;
    }
    return setPosition(currentX - 1, currentY);
  } else if (direction === 'right') {
    if (currentX >= props.sideLength - 1) {
      return;
    }
    return setPosition(currentX + 1, currentY);
  } else if (direction === 'up') {
    if (currentY <= 0) {
      return;
    }
    return setPosition(currentX, currentY - 1);
  } else if (direction === 'down') {
    if (currentY >= props.sideLength - 1) {
      return;
    }
    return setPosition(currentX, currentY + 1);
  } else {
    return;
  }
};

const comeTogether = async () => {
  return new Promise((resolve, reject) => {
    window.requestAnimationFrame(() => {
      if (!puzzlePiece.value) {
        return;
      }
      const centerDeltaX = (props.sideLength / 2) - (startX + .5);
      const centerDeltaY = (props.sideLength / 2) - (startY + .5);
      const centerHypotenuse = Math.sqrt(Math.pow(centerDeltaX, 2) + Math.pow(centerDeltaY, 2));
      const centerTheta = Math.atan2(centerDeltaY , centerDeltaX);
      puzzlePiece.value.addEventListener(getTransitionEndName(), (e) => {
        window.requestAnimationFrame(() => {
          if (!puzzlePiece.value) {
            return resolve(null);
          }
          puzzlePiece.value.style.transition = 'transform 100ms ease 100ms';
          let comeTogetherDeltaX = (props.sideLength / 2) - startX * 2 * 2 + 4;
          let comeTogetherDeltaY = (props.sideLength / 2) - startY * 2 * 2 + 4;
          puzzlePiece.value.style.transform = `translate3d(${comeTogetherDeltaX}px, ${comeTogetherDeltaY}px, 0)`;
          puzzlePiece.value.addEventListener(getTransitionEndName(), (e) => {
            resolve(null);
          });
        });
      }, {
        once: true
      });
      const translateXPx = Math.floor(12 * -Math.cos(centerTheta) * Math.pow(centerHypotenuse, 1.5));
      const translateYPx = Math.floor(12 * -Math.sin(centerTheta) * Math.pow(centerHypotenuse, 1.5));
      puzzlePiece.value.style.transition = 'transform 500ms ease';
      puzzlePiece.value.style.transform = `translate3d(${translateXPx}px, ${translateYPx}px, 0)`;
      if (props.isEmptySpace) {
        puzzlePiece.value.style.visibility = 'visible';
      }
    });
  });
};

const enableAnimation = async () => {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      if (!puzzlePiece.value) {
        return;
      }
      animationEnabled = true;
      const slideSpeed = 50 * Math.pow(4 / props.sideLength, 2);
      puzzlePiece.value.style.transition = `transform ${slideSpeed}ms linear`;
      return resolve(null);
    });
  });
};

const reset = () => {
  if (!puzzlePiece.value) {
    return;
  }
  if (props.isEmptySpace) {
    puzzlePiece.value.style.visibility = 'hidden';
  }
  animationEnabled = false;
  puzzlePiece.value.style.transition = '';
}

onMounted(() => {
  reset();
});

defineExpose({
  setDataURL,
  setPosition,
  enableAnimation,
  comeTogether,
  slide,
  reset,
  index: props.index
});

</script>

<template>
  <div ref="puzzlePiece" class="puzzle-piece">
    <img ref="pieceImage" />
  </div>
</template>

<style scoped>
.puzzle-piece {
  display: flex;
  position: relative;
  transform: translate3d(0, 0, 0);
  will-change: transition, transform;
  visibility: hidden;
}
.puzzle-piece img {
  max-width: 100%;
  padding: 2px;
}
</style>
