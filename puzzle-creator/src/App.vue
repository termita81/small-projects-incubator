<script setup>
import { ref } from 'vue'
import ImageUploader from './components/ImageUploader.vue'
import GameControls from './components/GameControls.vue'
import PuzzleTray from './components/PuzzleTray.vue'
import AssemblyArea from './components/AssemblyArea.vue'
import { usePuzzleGame } from './composables/usePuzzleGame'

const {
  gameState,
  uploadImage,
  startPuzzle,
  resetPuzzle,
  movePiece,
  togglePreview
} = usePuzzleGame()
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>🧩 Jigsaw Puzzle Creator</h1>
    </header>

    <main class="app-main">
      <!-- Image Upload Screen -->
      <div v-if="!gameState.imageUrl" class="upload-screen">
        <ImageUploader @image-uploaded="uploadImage" />
      </div>

      <!-- Game Screen -->
      <div v-else class="game-screen">
        <GameControls
          :game-state="gameState"
          @start-puzzle="startPuzzle"
          @reset-puzzle="resetPuzzle"
          @toggle-preview="togglePreview"
        />

        <div class="game-area">
          <AssemblyArea
            :game-state="gameState"
            @move-piece="movePiece"
          />

          <PuzzleTray
            :game-state="gameState"
            @move-piece="movePiece"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style>
:root {
  --primary-color: #4a90e2;
  --secondary-color: #50c878;
  --background: #f8f9fa;
  --surface: #ffffff;
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --border: #e1e8ed;
  --shadow: rgba(0, 0, 0, 0.1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--background);
  color: var(--text-primary);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--surface);
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 8px var(--shadow);
  text-align: center;
}

.app-header h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
}

.app-main {
  flex: 1;
  padding: 2rem;
}

.upload-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.game-screen {
  max-width: 1400px;
  margin: 0 auto;
}

.game-area {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .game-area {
    grid-template-columns: 1fr;
  }
}
</style>
