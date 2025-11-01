import { ref, reactive, onUnmounted } from 'vue'
import { generatePuzzlePieces, arePiecesAdjacent, shouldSnapToPosition } from '../utils/puzzleGenerator'

export function usePuzzleGame() {
  const gameState = reactive({
    imageUrl: null,
    image: null,
    difficulty: 16,
    pieces: [],
    isPlaying: false,
    isCompleted: false,
    showPreview: false,
    elapsedTime: 0,
    moveCount: 0,
    placedPieces: 0,
    totalPieces: 0
  })

  let timerInterval = null

  const uploadImage = (imageUrl) => {
    gameState.imageUrl = imageUrl

    // Load image
    const img = new Image()
    img.onload = () => {
      gameState.image = img
      // Auto-start with default difficulty
      // startPuzzle(16)
    }
    img.src = imageUrl
  }

  const startPuzzle = (difficulty) => {
    if (!gameState.image) return

    gameState.difficulty = difficulty
    gameState.isPlaying = true
    gameState.isCompleted = false
    gameState.elapsedTime = 0
    gameState.moveCount = 0
    gameState.placedPieces = 0
    gameState.showPreview = false

    // Generate puzzle pieces
    const pieces = generatePuzzlePieces(gameState.image, difficulty)
    gameState.pieces = pieces
    gameState.totalPieces = pieces.length

    // Shuffle pieces in tray
    shufflePieces()

    // Start timer
    startTimer()

    // Save to local storage
    saveGameState()
  }

  const resetPuzzle = () => {
    stopTimer()
    gameState.imageUrl = null
    gameState.image = null
    gameState.pieces = []
    gameState.isPlaying = false
    gameState.isCompleted = false
    gameState.elapsedTime = 0
    gameState.moveCount = 0
    gameState.placedPieces = 0

    // Clear local storage
    localStorage.removeItem('puzzleGameState')
  }

  const movePiece = (pieceId, newLocation, newX, newY) => {
    const piece = gameState.pieces.find(p => p.id === pieceId)
    if (!piece) return

    const wasInTray = piece.location === 'tray'

    piece.location = newLocation
    piece.x = newX
    piece.y = newY

    // Only increment move count when dragging, not when clicking from tray
    if (!wasInTray) {
      gameState.moveCount++
    }

    // Check if piece is in correct position
    if (newLocation === 'assembly') {
      checkPiecePlacement(piece)
      checkAdjacentPieces(piece)
    }

    // Check win condition
    checkWinCondition()

    // Save state
    saveGameState()
  }

  const checkPiecePlacement = (piece) => {
    const tolerance = 30 // pixels
    const isCorrect =
      Math.abs(piece.x - piece.correctX) < tolerance &&
      Math.abs(piece.y - piece.correctY) < tolerance

    if (isCorrect && !piece.isPlaced) {
      piece.isPlaced = true
      piece.x = piece.correctX
      piece.y = piece.correctY
      gameState.placedPieces++

      // Play a snap sound or visual feedback here
      console.log('Piece snapped into place!', piece.id)
    }
  }

  const checkAdjacentPieces = (movedPiece) => {
    if (!movedPiece.isPlaced) return

    // Check all other pieces in assembly area
    gameState.pieces.forEach(otherPiece => {
      if (
        otherPiece === movedPiece ||
        otherPiece.location !== 'assembly' ||
        !otherPiece.isPlaced
      ) {
        return
      }

      // Check if pieces are adjacent in the puzzle
      if (arePiecesAdjacent(movedPiece, otherPiece)) {
        // Connect pieces to same group
        if (!movedPiece.groupId && !otherPiece.groupId) {
          // Create new group
          const groupId = Date.now() + Math.random()
          movedPiece.groupId = groupId
          otherPiece.groupId = groupId
        } else if (movedPiece.groupId && !otherPiece.groupId) {
          otherPiece.groupId = movedPiece.groupId
        } else if (!movedPiece.groupId && otherPiece.groupId) {
          movedPiece.groupId = otherPiece.groupId
        } else if (movedPiece.groupId !== otherPiece.groupId) {
          // Merge groups
          const oldGroupId = otherPiece.groupId
          const newGroupId = movedPiece.groupId
          gameState.pieces.forEach(p => {
            if (p.groupId === oldGroupId) {
              p.groupId = newGroupId
            }
          })
        }
      }
    })
  }

  const checkWinCondition = () => {
    if (gameState.placedPieces === gameState.totalPieces) {
      gameState.isCompleted = true
      stopTimer()
      saveHighScore()
    }
  }

  const togglePreview = () => {
    gameState.showPreview = !gameState.showPreview
  }

  const shufflePieces = () => {
    // Fisher-Yates shuffle
    for (let i = gameState.pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[gameState.pieces[i], gameState.pieces[j]] = [gameState.pieces[j], gameState.pieces[i]]
    }
  }

  const startTimer = () => {
    stopTimer()
    timerInterval = setInterval(() => {
      gameState.elapsedTime++
    }, 1000)
  }

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const saveGameState = () => {
    try {
      const stateToSave = {
        imageUrl: gameState.imageUrl,
        difficulty: gameState.difficulty,
        pieces: gameState.pieces,
        isPlaying: gameState.isPlaying,
        elapsedTime: gameState.elapsedTime,
        moveCount: gameState.moveCount,
        placedPieces: gameState.placedPieces,
        totalPieces: gameState.totalPieces
      }
      localStorage.setItem('puzzleGameState', JSON.stringify(stateToSave))
    } catch (err) {
      console.error('Failed to save game state:', err)
    }
  }

  const loadGameState = () => {
    try {
      const saved = localStorage.getItem('puzzleGameState')
      if (saved) {
        const state = JSON.parse(saved)
        Object.assign(gameState, state)

        // Reload image
        if (state.imageUrl) {
          const img = new Image()
          img.onload = () => {
            gameState.image = img
            if (state.isPlaying) {
              startTimer()
            }
          }
          img.src = state.imageUrl
        }
      }
    } catch (err) {
      console.error('Failed to load game state:', err)
    }
  }

  const saveHighScore = () => {
    try {
      const highScores = JSON.parse(localStorage.getItem('puzzleHighScores') || '[]')
      highScores.push({
        difficulty: gameState.difficulty,
        time: gameState.elapsedTime,
        moves: gameState.moveCount,
        date: new Date().toISOString()
      })

      // Keep only top 10 scores
      highScores.sort((a, b) => a.time - b.time)
      highScores.splice(10)

      localStorage.setItem('puzzleHighScores', JSON.stringify(highScores))
    } catch (err) {
      console.error('Failed to save high score:', err)
    }
  }

  // Load saved game on mount
  loadGameState()

  // Cleanup on unmount
  onUnmounted(() => {
    stopTimer()
  })

  return {
    gameState,
    uploadImage,
    startPuzzle,
    resetPuzzle,
    movePiece,
    togglePreview
  }
}
