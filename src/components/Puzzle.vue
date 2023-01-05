<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import type { Ref } from 'vue';
import PuzzlePiece from './PuzzlePiece.vue';

const feather = inject('feather');

const props = defineProps<{
  imageUrl: string,
  sideLength?: number,
  shuffleMoves?: number
}>();

const emit = defineEmits([
  'animationComplete',
  'wantsMoar'
]);

type PieceMove = {
  tile: number,
  tileIndex: number,
  direction: string
};

type ShuffledState = {
  moves: PieceMove[];
  boardState: number[]
};

let solved = false;

const sideLength = props.sideLength || 4;

const puzzleImage = new Image();
puzzleImage.src = props.imageUrl;

const puzzleWrapper = ref<HTMLElement | null>(null);
const replay = ref<HTMLElement | null>(null);
const puzzlePieces: typeof PuzzlePiece[] = Array(sideLength * sideLength);

// @ts-ignore
const setPuzzlePieceRefs = (el) => {
  if (!el) {
    return;
  }
  puzzlePieces[el.index] = el;
};

const shuffleArray = (array:any[]) => {
  let shuffledMoves = array.map(el => el);
  let currentIndex = shuffledMoves.length;
  let randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffledMoves[currentIndex], shuffledMoves[randomIndex]] = [shuffledMoves[randomIndex], shuffledMoves[currentIndex]];
  }
  return shuffledMoves;
}

const shuffle = async (moveCount?:number):Promise<ShuffledState|undefined> => {
  let moves:PieceMove[] = [];
  let boardStates:number[][] = [[...Array(sideLength * sideLength).keys()]];
  const emptySpaceTile = sideLength * sideLength - 1;
  const shuffleMoves = moveCount || (Math.pow(sideLength - 1, 3) + Math.pow(sideLength - 1, 2)) + sideLength;
  let emptySpaceTileIndex = sideLength * sideLength - 1;
  for (let i = 0; i < shuffleMoves; i++) {
    let availableMoves:PieceMove[] = [];
    let emptySpaceX = emptySpaceTileIndex % sideLength;
    let emptySpaceY = Math.floor(emptySpaceTileIndex / sideLength);
    let currentBoardState = boardStates[i];
    if (emptySpaceX !== 0) {
      availableMoves.push({
        tile: currentBoardState[emptySpaceTileIndex - 1],
        tileIndex: emptySpaceTileIndex - 1,
        direction: 'right'
      });
    }
    if (emptySpaceX !== sideLength - 1) {
      availableMoves.push({
        tile: currentBoardState[emptySpaceTileIndex + 1],
        tileIndex: emptySpaceTileIndex + 1,
        direction: 'left'
      });
    }
    if (emptySpaceY !== 0) {
      availableMoves.push({
        tile: currentBoardState[emptySpaceTileIndex - sideLength],
        tileIndex: emptySpaceTileIndex - sideLength,
        direction: 'down'
      });
    }
    if (emptySpaceY !== sideLength - 1) {
      availableMoves.push({
        tile: currentBoardState[emptySpaceTileIndex + sideLength],
        tileIndex: emptySpaceTileIndex + sideLength,
        direction: 'up'
      });
    }
    let identicalState:number[] | undefined;
    let nextMove:PieceMove | undefined;
    let newBoardState:number[] | undefined;
    let shuffledAvailableMoves:PieceMove[] = shuffleArray(availableMoves);
    for (let j = 0; j < shuffledAvailableMoves.length; j++) {
      nextMove = shuffledAvailableMoves[j];
      newBoardState = boardStates[i].map((index) => {
        return index;
      });
      newBoardState[nextMove.tileIndex] = emptySpaceTile;
      newBoardState[emptySpaceTileIndex] = nextMove.tile;
      identicalState = boardStates.find((oldState) => {
        return !oldState.find((el, i) => {
          return newBoardState && el !== newBoardState[i];
        });
      });
      if (!identicalState) {
        break;
      }
      nextMove = undefined;
      newBoardState = undefined;
    }
    if (!nextMove) {
      break;
    }
    emptySpaceTileIndex = nextMove.tileIndex || 0;
    newBoardState && boardStates.push(newBoardState);
    moves.push(nextMove);
  }
  solved = false;
  puzzleWrapper.value?.classList.remove('solved');
  const finalBoardState = boardStates[boardStates.length - 1];
  await Promise.all(puzzlePieces.map((puzzlePiece, i) => {
    let setPositionFn;
    if (finalBoardState[i] === emptySpaceTile) {
      setPositionFn = puzzlePieces[finalBoardState[i]].setPosition(sideLength - 1, sideLength - 1);
    } else {
      setPositionFn = puzzlePieces[finalBoardState[i]].setPosition(i % sideLength, Math.floor(i / sideLength));
    }
    return setPositionFn.then(() => puzzlePieces[finalBoardState[i]].enableAnimation());
  }));
  return {
    moves: moves,
    boardState: finalBoardState
  };
};

const solve = async (shuffledState:ShuffledState) => {
  const solutionMoves = shuffledState.moves.map((move) => {
    let solutionDirection;
    if (move.direction === 'left') {
      solutionDirection = 'right';
    } else if (move.direction === 'right') {
      solutionDirection = 'left';
    } else if (move.direction === 'up') {
      solutionDirection = 'down';
    } else {
      solutionDirection = 'up';
    }
    return {
      tile: move.tile,
      direction: solutionDirection
    };
  }).reverse();
  for (let i = 0; i < solutionMoves.length; i++) {
    await puzzlePieces[solutionMoves[i].tile].slide(solutionMoves[i].direction);
  }
  await Promise.all(puzzlePieces.map((puzzlePiece) => {
    return puzzlePiece.comeTogether();
  }));
  emit('animationComplete');
  solved = true;
  puzzleWrapper.value?.classList.add('solved');
  replay.value?.classList.remove('hidden');
}

const drawPieceImages = async () => {
  const drawPromises = [];
  const pieceWidth = puzzleImage.width / sideLength;
  const pieceHeight = puzzleImage.height / sideLength;
  for (let x = 0; x < sideLength; x++) {
    for (let y = 0; y < sideLength; y++) {
      const canvas = document.createElement('canvas');
      canvas.width = pieceWidth;
      canvas.height = pieceHeight;
      let context = canvas.getContext('2d');
      if (context) {
        context.drawImage(puzzleImage, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0, 0, canvas.width, canvas.height);
      }
      drawPromises.push(puzzlePieces[y * sideLength + x].setDataURL(canvas.toDataURL()));
    }
  }
  return Promise.all(drawPromises);
};

const render = async () => {
  for (let i = 0; i < puzzlePieces.length; i++) {
    puzzlePieces[i].reset();
  }
  await new Promise((resolve) => {
    puzzleImage.onload = () => {
      drawPieceImages().then(resolve);
    };
  });
  const shuffledState = await shuffle();
  if (!shuffledState) {
    return;
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      solve(shuffledState).then(resolve);
    }, 200);
  });
};

const isSolved = () => {
  return solved;
};

const wantsMoar = () => {
  if (isSolved()) {
    emit('wantsMoar');
  }
};

onMounted(async () => {
  await render();
});

defineExpose({
  isSolved,
  render
});

</script>

<template>
  <div ref="puzzleWrapper" class="puzzle-wrapper" @mouseup="wantsMoar">
    <i ref="replay" class="replay hidden" v-html="
      // @ts-ignore
      feather.icons['rotate-ccw'].toSvg()
    "></i>
    <div v-for="y in sideLength" :key="y" class="puzzle-row">
      <PuzzlePiece v-for="x in sideLength" :key="x" :ref="setPuzzlePieceRefs"
        :index="(y - 1) * sideLength + (x - 1)"
        :sideLength="sideLength"
        :isEmptySpace="((y - 1) * sideLength + (x - 1)) === (sideLength * sideLength - 1)"
        />
    </div>
  </div>
</template>

<style scoped>
.puzzle-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 480px;
  max-height: 480px;
  position: relative;
  bottom: 8px;
  user-select: none;
}

.puzzle-wrapper.solved {
  cursor: pointer;
}

.puzzle-row {
  display: flex;
  min-height: 0;
}
.replay {
  opacity: .5;
  color: #AAAAAA;
  position: absolute;
  z-index: 1;
  left: 24px;
  top: 24px;
  width: 24px;
  height: 24px;
}
.replay.hidden {
  display: none;
}
</style>
