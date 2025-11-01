<script setup>
import { computed } from 'vue'

const props = defineProps({
  gameState: Object
})

const emit = defineEmits(['start-puzzle', 'reset-puzzle', 'toggle-preview'])

const difficultyLevels = [
  { value: 9, label: 'Easy (3×3)' },
  { value: 16, label: 'Medium (4×4)' },
  { value: 25, label: 'Hard (5×5)' },
  { value: 36, label: 'Expert (6×6)' }
]

const selectedDifficulty = computed(() => props.gameState.difficulty || 16)

const startGame = (difficulty) => {
  emit('start-puzzle', difficulty)
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="game-controls">
    <!-- Pre-game: Select Difficulty -->
    <div v-if="!gameState.isPlaying" class="difficulty-selector">
      <h3>Choose Difficulty</h3>
      <div class="difficulty-buttons">
        <button
          v-for="level in difficultyLevels"
          :key="level.value"
          class="difficulty-btn"
          :class="{ selected: level.value === selectedDifficulty }"
          @click="startGame(level.value)"
        >
          {{ level.label }}
        </button>
      </div>
    </div>

    <!-- In-game: Stats and Controls -->
    <div v-else class="game-stats">
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Time</span>
          <span class="stat-value">{{ formatTime(gameState.elapsedTime || 0) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Moves</span>
          <span class="stat-value">{{ gameState.moveCount || 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Placed</span>
          <span class="stat-value">{{ gameState.placedPieces || 0 }}/{{ gameState.totalPieces || 0 }}</span>
        </div>
      </div>

      <div class="control-buttons">
        <button class="control-btn" @click="emit('toggle-preview')">
          👁️ {{ gameState.showPreview ? 'Hide' : 'Show' }} Preview
        </button>
        <button class="control-btn reset-btn" @click="emit('reset-puzzle')">
          🔄 New Puzzle
        </button>
      </div>
    </div>

    <!-- Victory Message -->
    <div v-if="gameState.isCompleted" class="victory-message">
      <h2>🎉 Puzzle Completed!</h2>
      <p>Time: {{ formatTime(gameState.elapsedTime) }} | Moves: {{ gameState.moveCount }}</p>
    </div>
  </div>
</template>

<style scoped>
.game-controls {
  background: var(--surface);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--shadow);
}

.difficulty-selector h3 {
  margin-bottom: 1rem;
  text-align: center;
  color: var(--text-primary);
}

.difficulty-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.difficulty-btn {
  padding: 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.difficulty-btn:hover {
  border-color: var(--primary-color);
  background: #f0f7ff;
}

.difficulty-btn.selected {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

.game-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 0.75rem;
  background: var(--background);
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
}

.control-buttons {
  display: flex;
  gap: 0.75rem;
}

.control-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow);
}

.reset-btn {
  background: var(--text-secondary);
}

.victory-message {
  margin-top: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  border-radius: 12px;
  text-align: center;
  color: white;
  animation: slideIn 0.5s ease;
}

.victory-message h2 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.victory-message p {
  font-size: 0.95rem;
  opacity: 0.95;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
