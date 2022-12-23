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

const pieceImage = ref<HTMLInputElement | null>(null);

const setDataURL = (dataURL:string) => {
  if (pieceImage.value) {
    pieceImage.value.src = dataURL;
  }
};

const setPosition = async (x:number, y:number) => {
  return new Promise((resolve, reject) => {
    currentX = x;
    currentY = y;
    if (!pieceImage.value) {
      return;
    }
    let xDiff = currentX - startX;
    let yDiff = currentY - startY;
    let hasResolved = false;
    pieceImage.value.addEventListener(getTransitionEndName(), (e) => {
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
    pieceImage.value.style.transform = `translate3d(${xDiff * 100}%, ${yDiff * 100}%, 0)`;
    setTimeout(() => {
      if (!hasResolved) {
        return resolve({
          x: currentX,
          y: currentY
        });
      }
    }, 1000);
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
    if (!pieceImage.value) {
      return;
    }
    const centerDeltaX = (props.sideLength / 2) - (startX + .5);
    const centerDeltaY = (props.sideLength / 2) - (startY + .5);
    const centerHypotenuse = Math.sqrt(Math.pow(centerDeltaX, 2) + Math.pow(centerDeltaY, 2));
    const centerTheta = Math.atan2(centerDeltaY , centerDeltaX);
    pieceImage.value.addEventListener(getTransitionEndName(), (e) => {
      if (!pieceImage.value) {
        return resolve(null);
      }
      pieceImage.value.style.transition = 'transform .1s';
      let comeTogetherDeltaX = (props.sideLength / 2) - startX * 2 * 2 + 4;
      let comeTogetherDeltaY = (props.sideLength / 2) - startY * 2 * 2 + 4;
      pieceImage.value.style.transform = `translate3d(${comeTogetherDeltaX}px, ${comeTogetherDeltaY}px, 0)`;
      pieceImage.value.addEventListener(getTransitionEndName(), (e) => {
        resolve(null);
      });
    }, {
      once: true
    });
    pieceImage.value.style.transition = 'transform .5s';
    pieceImage.value.style.visibility = 'visible';
    pieceImage.value.style.transform = `translate3d(${10 * -Math.cos(centerTheta) * Math.pow(centerHypotenuse, 1.5)}px, ${10 * -Math.sin(centerTheta) * Math.pow(centerHypotenuse, 1.5)}px, 0)`;
  });
};

const enableAnimation = () => {
  if (!pieceImage.value) {
    return;
  }
  const slideSpeed = .05 * Math.pow(4 / props.sideLength, 2.5);
  pieceImage.value.style.transition = `transform ${slideSpeed}s`;
};

const reset = () => {
  if (!pieceImage.value) {
    return;
  }
  if (props.isEmptySpace) {
    pieceImage.value.style.visibility = 'hidden';
  }
  pieceImage.value.style.transition = '';
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
  <div class="puzzle-piece">
    <img ref="pieceImage" />
  </div>
</template>

<style scoped>
.puzzle-piece {
  display: flex;
  position: relative;
}
.puzzle-piece img {
  transform: translate3d(0, 0, 0);
  max-width: 100%;
  padding: 2px;
}
</style>
