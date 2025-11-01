import { ref, reactive } from 'vue'

export function useDragAndDrop() {
  const dragState = reactive({
    isDragging: false,
    draggedPiece: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    currentX: 0,
    currentY: 0
  })

  const startDrag = (piece, mouseX, mouseY, canvasRect) => {
    dragState.isDragging = true
    dragState.draggedPiece = piece
    dragState.startX = mouseX
    dragState.startY = mouseY

    // Calculate offset from mouse to piece origin
    dragState.offsetX = mouseX - canvasRect.left - piece.x
    dragState.offsetY = mouseY - canvasRect.top - piece.y
  }

  const updateDrag = (mouseX, mouseY, canvasRect) => {
    if (!dragState.isDragging) return

    dragState.currentX = mouseX - canvasRect.left - dragState.offsetX
    dragState.currentY = mouseY - canvasRect.top - dragState.offsetY
  }

  const endDrag = () => {
    const result = {
      piece: dragState.draggedPiece,
      x: dragState.currentX,
      y: dragState.currentY
    }

    // Reset drag state
    dragState.isDragging = false
    dragState.draggedPiece = null
    dragState.startX = 0
    dragState.startY = 0
    dragState.offsetX = 0
    dragState.offsetY = 0
    dragState.currentX = 0
    dragState.currentY = 0

    return result
  }

  const cancelDrag = () => {
    dragState.isDragging = false
    dragState.draggedPiece = null
  }

  return {
    dragState,
    startDrag,
    updateDrag,
    endDrag,
    cancelDrag
  }
}
