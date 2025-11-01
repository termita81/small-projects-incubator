/**
 * Generates puzzle pieces from an image
 * @param {HTMLImageElement} image - The source image
 * @param {number} pieceCount - Total number of pieces (must be a perfect square)
 * @returns {Array} Array of puzzle piece objects
 */
export function generatePuzzlePieces(image, pieceCount) {
  const cols = Math.sqrt(pieceCount)
  const rows = cols

  if (!Number.isInteger(cols)) {
    throw new Error('pieceCount must be a perfect square (4, 9, 16, 25, etc.)')
  }

  const pieces = []
  const pieceWidth = image.width / cols
  const pieceHeight = image.height / rows

  let id = 0

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const piece = {
        id: id++,
        row,
        col,
        // Source position in original image
        sourceX: col * pieceWidth,
        sourceY: row * pieceHeight,
        width: pieceWidth,
        height: pieceHeight,
        // Current position (will be set when rendering)
        x: 0,
        y: 0,
        // Correct position in assembly area
        correctX: col * pieceWidth,
        correctY: row * pieceHeight,
        // Location: 'tray' or 'assembly'
        location: 'tray',
        // Placement status
        isPlaced: false,
        // Group ID for connected pieces
        groupId: null,
        // Edge types for interlocking (future enhancement)
        edges: {
          top: row === 0 ? 'flat' : randomEdge(),
          right: col === cols - 1 ? 'flat' : randomEdge(),
          bottom: row === rows - 1 ? 'flat' : randomEdge(),
          left: col === 0 ? 'flat' : randomEdge()
        }
      }

      pieces.push(piece)
    }
  }

  // Ensure adjacent pieces have matching edges
  matchAdjacentEdges(pieces, rows, cols)

  return pieces
}

/**
 * Generates a random edge type (tab or blank)
 */
function randomEdge() {
  return Math.random() > 0.5 ? 'tab' : 'blank'
}

/**
 * Ensures adjacent pieces have complementary edges
 */
function matchAdjacentEdges(pieces, rows, cols) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col
      const piece = pieces[index]

      // Match right edge with left edge of next piece
      if (col < cols - 1) {
        const rightPiece = pieces[index + 1]
        rightPiece.edges.left = piece.edges.right === 'tab' ? 'blank' : 'tab'
      }

      // Match bottom edge with top edge of piece below
      if (row < rows - 1) {
        const bottomPiece = pieces[index + cols]
        bottomPiece.edges.top = piece.edges.bottom === 'tab' ? 'blank' : 'tab'
      }
    }
  }
}

/**
 * Checks if two pieces are adjacent
 */
export function arePiecesAdjacent(piece1, piece2) {
  const rowDiff = Math.abs(piece1.row - piece2.row)
  const colDiff = Math.abs(piece1.col - piece2.col)

  return (
    (rowDiff === 1 && colDiff === 0) || // Vertically adjacent
    (rowDiff === 0 && colDiff === 1)    // Horizontally adjacent
  )
}

/**
 * Checks if a piece is close enough to snap to correct position
 */
export function shouldSnapToPosition(piece, tolerance = 30) {
  const distanceX = Math.abs(piece.x - piece.correctX)
  const distanceY = Math.abs(piece.y - piece.correctY)

  return distanceX < tolerance && distanceY < tolerance
}

/**
 * Gets pieces in the same group
 */
export function getPieceGroup(pieces, groupId) {
  return pieces.filter(p => p.groupId === groupId)
}

/**
 * Merges two piece groups
 */
export function mergePieceGroups(pieces, groupId1, groupId2) {
  const newGroupId = Math.min(groupId1, groupId2)

  pieces.forEach(piece => {
    if (piece.groupId === groupId1 || piece.groupId === groupId2) {
      piece.groupId = newGroupId
    }
  })

  return newGroupId
}
