<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
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

const replay = ref<HTMLElement | null>(null);
const puzzlePieces:PuzzlePiece[] = Array(sideLength * sideLength);

const setPuzzlePieceRefs = (el:PuzzlePiece) => {
  if (!el) {
    return;
  }
  puzzlePieces[el.index] = el;
};

const shuffle = (moveCount?:number):ShuffledState|undefined => {
  let moves:PieceMove[] = [];
  let boardStates:number[][] = [[...Array(sideLength * sideLength).keys()]];
  const emptySpaceTile = sideLength * sideLength - 1;
  const shuffleMoves = moveCount || Math.pow(sideLength - 1, 3);
  let emptySpaceTileIndex = sideLength * sideLength - 1;
  for (let i = 0; i < shuffleMoves; i++) {
    let availableMoves:{tile: number, tileIndex: number, direction: string}[] = [];
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
    let nextMove:PieceMove;
    let newBoardState:number[];
    do {
      nextMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      if (!nextMove) {
        return;
      }
      newBoardState = boardStates[i].map((index) => {
        return index;
      });
      newBoardState[nextMove.tileIndex] = emptySpaceTile;
      newBoardState[emptySpaceTileIndex] = nextMove.tile;
      identicalState = boardStates.find((oldState) => {
        return !oldState.find((el, i) => {
          return el !== newBoardState[i];
        });
      });
    } while (!!identicalState && availableMoves.length);
    emptySpaceTileIndex = nextMove.tileIndex || 0;
    boardStates.push(newBoardState);
    moves.push(nextMove);
  }
  solved = false;
  return {
    moves: moves,
    boardState: boardStates[boardStates.length - 1]
  };
};

const solve = (shuffledState:ShuffledState) => {
  const emptySpaceTile = sideLength * sideLength - 1;
  for (let i = 0; i < puzzlePieces.length; i++) {
    if (shuffledState.boardState[i] === emptySpaceTile) {
      puzzlePieces[shuffledState.boardState[i]].setPosition(sideLength - 1, sideLength - 1);
    } else {
      puzzlePieces[shuffledState.boardState[i]].setPosition(i % sideLength, Math.floor(i / sideLength));
    }
    puzzlePieces[shuffledState.boardState[i]].enableAnimation();
  }
  setTimeout(async () => {
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
    replay.value?.classList.remove('hidden');
  }, 500);
}

const drawPieceImages = () => {
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
      puzzlePieces[y * sideLength + x].setDataURL(canvas.toDataURL());
    }
  }
};

const render = () => {
  for (let i = 0; i < puzzlePieces.length; i++) {
    puzzlePieces[i].reset();
  }
  puzzleImage.onload = () => {
    drawPieceImages();
  };
  const shuffledState = shuffle();
  if (!shuffledState) {
    return;
  }
  solve(shuffledState);
};

const isSolved = () => {
  return solved;
};

const wantsMoar = () => {
  if (isSolved()) {
    emit('wantsMoar');
  }
};

onMounted(() => {
  render();
});

defineExpose({
  isSolved,
  render
});

</script>

<template>
  <div ref="puzzle-wrapper" class="puzzle-wrapper">
    <!-- <i class="replay hidden" data-feather="rotate-ccw"></i> -->
    <i ref="replay" class="replay hidden" v-html="feather.icons['rotate-ccw'].toSvg()" @mouseup="wantsMoar"></i>
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
  margin: 8px;
  position: relative;
  bottom: 8px;
  user-select: none;
}
.puzzle-row {
  display: flex;
  min-height: 0;
}
.replay {
  cursor: pointer;
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
