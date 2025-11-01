<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  gameState: Object
})

const emit = defineEmits(['move-piece'])

const canvas = ref(null)
const ctx = ref(null)

const trayPieces = computed(() => {
  if (!props.gameState.pieces) return []
  return props.gameState.pieces.filter(p => p.location === 'tray')
})

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    setupCanvas()
  }
})

watch(() => props.gameState.pieces, () => {
  if (ctx.value) {
    render()
  }
}, { deep: true })

const setupCanvas = () => {
  canvas.value.width = 280
  canvas.value.height = 600
  render()
}

const render = () => {
  if (!ctx.value) return

  // Clear canvas
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

  // Draw tray background
  ctx.value.fillStyle = '#ffffff'
  ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height)

  // Draw pieces in tray
  trayPieces.value.forEach((piece, index) => {
    drawTrayPiece(piece, index)
  })
}

const drawTrayPiece = (piece, index) => {
  if (!piece || !props.gameState.image) return

  const cols = 2
  const spacing = 10
  const pieceSize = (canvas.value.width - spacing * (cols + 1)) / cols

  const col = index % cols
  const row = Math.floor(index / cols)

  const x = spacing + col * (pieceSize + spacing)
  const y = spacing + row * (pieceSize + spacing)

  ctx.value.save()

  // Draw shadow
  ctx.value.shadowColor = 'rgba(0, 0, 0, 0.15)'
  ctx.value.shadowBlur = 8
  ctx.value.shadowOffsetX = 2
  ctx.value.shadowOffsetY = 2

  // Draw piece
  ctx.value.drawImage(
    props.gameState.image,
    piece.sourceX, piece.sourceY, piece.width, piece.height,
    x, y, pieceSize, pieceSize
  )

  // Draw border
  ctx.value.strokeStyle = '#e1e8ed'
  ctx.value.lineWidth = 2
  ctx.value.strokeRect(x, y, pieceSize, pieceSize)

  ctx.value.restore()
}

const getPieceAtPosition = (x, y) => {
  const cols = 2
  const spacing = 10
  const pieceSize = (canvas.value.width - spacing * (cols + 1)) / cols

  for (let i = 0; i < trayPieces.value.length; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)

    const px = spacing + col * (pieceSize + spacing)
    const py = spacing + row * (pieceSize + spacing)

    if (x >= px && x <= px + pieceSize && y >= py && y <= py + pieceSize) {
      return trayPieces.value[i]
    }
  }
  return null
}

const handleMouseDown = (event) => {
  const rect = canvas.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const piece = getPieceAtPosition(x, y)
  if (piece) {
    // Move piece to assembly area at a random position near center
    const randomX = Math.random() * 100 + 50
    const randomY = Math.random() * 100 + 50

    emit('move-piece', piece.id, 'assembly', randomX, randomY)
  }
}
</script>

<template>
  <div class="puzzle-tray">
    <div class="tray-header">
      <h3>Puzzle Pieces</h3>
      <span class="piece-count">{{ trayPieces.length }} left</span>
    </div>
    <div class="tray-canvas-container">
      <canvas
        ref="canvas"
        @mousedown="handleMouseDown"
      ></canvas>
    </div>
  </div>
</template>

<style scoped>
.puzzle-tray {
  background: var(--surface);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px var(--shadow);
  display: flex;
  flex-direction: column;
  max-height: 700px;
}

.tray-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--border);
}

.tray-header h3 {
  font-size: 1.1rem;
  color: var(--text-primary);
}

.piece-count {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.tray-canvas-container {
  flex: 1;
  overflow-y: auto;
  border-radius: 8px;
}

canvas {
  display: block;
  cursor: pointer;
}
</style>
