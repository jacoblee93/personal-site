<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import PuzzlePiece from './PuzzlePiece.vue';

const props = defineProps<{
  imageUrl: string,
  shuffleMoves?: number
}>();
const emit = defineEmits(['animationComplete']);

const sideLength = 4;
const shuffleMoves = props.shuffleMoves || 30;
const emptySpaceTile = 15;

const puzzleImage = new Image();
puzzleImage.src = props.imageUrl;

const puzzlePieces:PuzzlePiece[] = [];

const setPuzzlePieceRefs = (el:PuzzlePiece) => {
  if (!el) {
    return;
  }
  puzzlePieces[el.index] = el;
};

const shufflePuzzle = () => {
  let moves = [];
  let boardStates:number[][] = [[...Array(sideLength * sideLength).keys()]];
  let emptySpaceTileIndex = 15;
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
    let nextMove:{tile: number, tileIndex: number, direction: string};
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
  return {
    moves: moves,
    boardState: boardStates[boardStates.length - 1]
  };
};

onMounted(() => {
  puzzleImage.onload = () => {
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
  const shuffledState = shufflePuzzle();
  if (!shuffledState) {
    return;
  }
  for (let i = 0; i < puzzlePieces.length; i++) {
    if (shuffledState.boardState[i] === emptySpaceTile) {
      puzzlePieces[shuffledState.boardState[i]].setPosition(3, 3);
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
  }, 500);
});

</script>

<template>
  <div class="puzzle-wrapper">
    <div v-for="y in sideLength" :key="y" class="puzzle-row">
      <PuzzlePiece v-for="x in sideLength" :key="x" :ref="setPuzzlePieceRefs"
        :index="(y - 1) * sideLength + (x - 1)"
        :sideLength="sideLength"
        :emptySpace="((y - 1) * sideLength + (x - 1)) === (sideLength * sideLength - 1)"
        />
    </div>
  </div>
</template>

<style scoped>
.puzzle-wrapper {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  max-width: 480px;
  max-height: 480px;
  margin: 8px;
  position: relative;
  bottom: 8px;
}
.puzzle-row {
  display: flex;
  min-height: 0;
}
</style>
