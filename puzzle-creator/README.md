# 🧩 Jigsaw Puzzle Creator

A web-based jigsaw puzzle creator and game built with Vue 3, Vite, and HTML5 Canvas. Upload your own images and turn them into interactive puzzles!

## Features

### Core Functionality
- **Image Upload**: Drag and drop or click to upload any image
- **Multiple Difficulty Levels**: Choose from Easy (3×3), Medium (4×4), Hard (5×5), or Expert (6×6)
- **Interactive Gameplay**:
  - Click pieces in the tray to move them to the assembly area
  - Drag pieces around the assembly area to position them
  - Auto-snap pieces when placed near their correct position
  - Pieces turn green when correctly placed
- **Piece Grouping**: Adjacent correctly-placed pieces automatically group together
- **Preview Toggle**: Show/hide a faded preview of the final image
- **Stats Tracking**: Track your time, move count, and progress
- **Local Storage**: Your progress is automatically saved

### UI Features
- Clean, modern design with smooth animations
- Responsive layout
- Visual feedback for piece placement
- Victory screen on completion

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## How to Play

1. **Upload an Image**:
   - Drag and drop an image onto the upload area, or click to browse
   - Supports JPG, PNG, GIF, and WebP formats

2. **Choose Difficulty**:
   - Select your preferred difficulty level
   - Higher levels = more pieces = more challenge

3. **Start Solving**:
   - Click pieces in the right tray to move them to the assembly area
   - Drag pieces around to position them correctly
   - Pieces will snap and turn green when placed correctly
   - Adjacent correct pieces automatically group together

4. **Use Preview**:
   - Toggle the preview to see a faded outline of the final image
   - Helps when you're stuck!

5. **Complete the Puzzle**:
   - Place all pieces correctly to win
   - See your final time and move count

## Technical Details

### Tech Stack
- **Vue 3**: Reactive UI framework
- **Vite**: Fast build tool and dev server
- **HTML5 Canvas**: For rendering puzzle pieces
- **CSS3**: Modern styling with CSS variables

### Project Structure
```
src/
├── components/
│   ├── ImageUploader.vue    # Image upload interface
│   ├── GameControls.vue      # Difficulty selector & stats
│   ├── AssemblyArea.vue      # Main puzzle canvas
│   └── PuzzleTray.vue        # Piece tray on the side
├── composables/
│   ├── usePuzzleGame.js      # Main game logic & state
│   └── useDragAndDrop.js     # Drag and drop utilities
├── utils/
│   └── puzzleGenerator.js    # Puzzle piece generation
├── App.vue                   # Root component
├── main.js                   # App entry point
└── style.css                 # Global styles
```

### Key Algorithms

**Puzzle Generation**:
- Images are divided into equal-sized rectangular pieces
- Each piece knows its correct position
- Edge types are generated for interlocking (future enhancement)

**Piece Snapping**:
- Pieces snap to their correct position when within 30 pixels
- Tolerance can be adjusted in `usePuzzleGame.js`

**Piece Grouping**:
- When a piece is correctly placed, adjacent correct pieces are detected
- Groups are created and merged automatically
- Future: Move entire groups together

## Future Enhancements

- [ ] Implement actual jigsaw-style interlocking pieces (tabs and blanks)
- [ ] Group dragging (move multiple connected pieces together)
- [ ] Sound effects for piece placement
- [ ] Hint system
- [ ] High score leaderboard
- [ ] Multiple save slots
- [ ] Share puzzle with friends
- [ ] Custom piece shapes
- [ ] Mobile touch support

## License

MIT License - see parent repository for details

## Development

Built as part of the small-projects-incubator repository using AI-assisted development with Claude Code.
