<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'

const props = defineProps({
  gameState: Object
})

const emit = defineEmits(['move-piece'])

const canvas = ref(null)
const ctx = ref(null)
const draggedPiece = ref(null)
const dragOffset = ref({ x: 0, y: 0 })
const isDragging = ref(false)

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    setupCanvas()
    window.addEventListener('resize', setupCanvas)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', setupCanvas)
})

watch(() => props.gameState, () => {
  if (ctx.value) {
    render()
  }
}, { deep: true })

const setupCanvas = () => {
  if (!canvas.value) return
  const container = canvas.value.parentElement
  canvas.value.width = container.clientWidth
  canvas.value.height = Math.min(600, container.clientWidth * 0.75)
  render()
}

const render = () => {
  if (!ctx.value) return

  // Clear canvas
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

  // Draw background
  ctx.value.fillStyle = '#f8f9fa'
  ctx.value.fillRect(0, 0, canvas.value.width, canvas.value.height)

  // Draw preview if enabled
  if (props.gameState.showPreview && props.gameState.image) {
    ctx.value.globalAlpha = 0.2
    const scale = Math.min(
      canvas.value.width / props.gameState.image.width,
      canvas.value.height / props.gameState.image.height
    )
    const width = props.gameState.image.width * scale
    const height = props.gameState.image.height * scale
    const x = (canvas.value.width - width) / 2
    const y = (canvas.value.height - height) / 2
    ctx.value.drawImage(props.gameState.image, x, y, width, height)
    ctx.value.globalAlpha = 1
  }

  // Draw pieces in assembly area (non-dragged first)
  if (props.gameState.pieces) {
    props.gameState.pieces.forEach(piece => {
      if (piece.location === 'assembly' && piece !== draggedPiece.value) {
        drawPiece(piece)
      }
    })

    // Draw dragged piece last (on top)
    if (draggedPiece.value && draggedPiece.value.location === 'assembly') {
      drawPiece(draggedPiece.value)
    }
  }
}

const drawPiece = (piece) => {
  if (!piece || !props.gameState.image) return

  const scale = Math.min(
    canvas.value.width / props.gameState.image.width,
    canvas.value.height / props.gameState.image.height
  )

  const scaledWidth = piece.width * scale
  const scaledHeight = piece.height * scale
  const offsetX = (canvas.value.width - props.gameState.image.width * scale) / 2
  const offsetY = (canvas.value.height - props.gameState.image.height * scale) / 2

  ctx.value.save()

  // Draw piece shadow
  if (piece !== draggedPiece.value) {
    ctx.value.shadowColor = 'rgba(0, 0, 0, 0.2)'
    ctx.value.shadowBlur = 10
    ctx.value.shadowOffsetX = 2
    ctx.value.shadowOffsetY = 2
  } else {
    ctx.value.shadowColor = 'rgba(0, 0, 0, 0.4)'
    ctx.value.shadowBlur = 20
    ctx.value.shadowOffsetX = 4
    ctx.value.shadowOffsetY = 4
  }

  // Draw piece
  ctx.value.drawImage(
    props.gameState.image,
    piece.sourceX, piece.sourceY, piece.width, piece.height,
    offsetX + piece.x * scale, offsetY + piece.y * scale, scaledWidth, scaledHeight
  )

  // Draw border
  ctx.value.strokeStyle = piece.isPlaced ? '#50c878' : '#4a90e2'
  ctx.value.lineWidth = piece.isPlaced ? 3 : 2
  ctx.value.strokeRect(offsetX + piece.x * scale, offsetY + piece.y * scale, scaledWidth, scaledHeight)

  ctx.value.restore()
}

const getPieceAtPosition = (x, y) => {
  if (!props.gameState.pieces) return null

  const scale = Math.min(
    canvas.value.width / props.gameState.image.width,
    canvas.value.height / props.gameState.image.height
  )
  const offsetX = (canvas.value.width - props.gameState.image.width * scale) / 2
  const offsetY = (canvas.value.height - props.gameState.image.height * scale) / 2

  // Check in reverse order (top pieces first)
  for (let i = props.gameState.pieces.length - 1; i >= 0; i--) {
    const piece = props.gameState.pieces[i]
    if (piece.location !== 'assembly') continue

    const px = offsetX + piece.x * scale
    const py = offsetY + piece.y * scale
    const pw = piece.width * scale
    const ph = piece.height * scale

    if (x >= px && x <= px + pw && y >= py && y <= py + ph) {
      return piece
    }
  }
  return null
}

const handleMouseDown = (event) => {
  const rect = canvas.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const piece = getPieceAtPosition(x, y)
  if (piece && !piece.isPlaced) {
    isDragging.value = true
    draggedPiece.value = piece

    const scale = Math.min(
      canvas.value.width / props.gameState.image.width,
      canvas.value.height / props.gameState.image.height
    )
    const offsetX = (canvas.value.width - props.gameState.image.width * scale) / 2
    const offsetY = (canvas.value.height - props.gameState.image.height * scale) / 2

    dragOffset.value = {
      x: x - (offsetX + piece.x * scale),
      y: y - (offsetY + piece.y * scale)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
}

const handleMouseMove = (event) => {
  if (!isDragging.value || !draggedPiece.value) return

  const rect = canvas.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  const scale = Math.min(
    canvas.value.width / props.gameState.image.width,
    canvas.value.height / props.gameState.image.height
  )
  const offsetX = (canvas.value.width - props.gameState.image.width * scale) / 2
  const offsetY = (canvas.value.height - props.gameState.image.height * scale) / 2

  draggedPiece.value.x = (x - offsetX - dragOffset.value.x) / scale
  draggedPiece.value.y = (y - offsetY - dragOffset.value.y) / scale

  render()
}

const handleMouseUp = () => {
  if (isDragging.value && draggedPiece.value) {
    emit('move-piece', draggedPiece.value.id, 'assembly', draggedPiece.value.x, draggedPiece.value.y)
  }

  isDragging.value = false
  draggedPiece.value = null

  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)

  render()
}
</script>

<template>
  <div class="assembly-area">
    <div class="canvas-container">
      <canvas
        ref="canvas"
        @mousedown="handleMouseDown"
      ></canvas>
    </div>
  </div>
</template>

<style scoped>
.assembly-area {
  background: var(--surface);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px var(--shadow);
}

.canvas-container {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
}

canvas {
  display: block;
  width: 100%;
  cursor: grab;
}

canvas:active {
  cursor: grabbing;
}
</style>
