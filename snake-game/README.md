# Nokia Snake Game - Advanced Edition

An enhanced version of the classic Nokia Snake game featuring advanced mechanics like wall wrapping and poisonous food, built with modern HTML5 Canvas technology while maintaining the authentic Nokia aesthetic.

## 🎮 Game Features

### Core Mechanics
- **Wall Wrapping**: Snake seamlessly passes through walls and appears on the opposite side
- **Dual Food System**: Normal green food for growth and dangerous red poisonous food
- **Progressive Difficulty**: Speed increases every 50 points
- **Smooth 60fps Gameplay**: Modern performance with classic Nokia look

### Advanced Features
- **Poisonous Food Mechanics**: 
  - Appears randomly (30-50% chance) after eating normal food
  - Disappears when normal food is consumed
  - Game over when eaten
  - Never spawns on snake's body
- **Smart AI**: Intelligent food placement avoiding collisions
- **Local High Score**: Persistent score tracking using localStorage

## 🎯 Game Rules

### Scoring
- **Green Food**: +10 points, makes snake grow by 1 segment
- **Red Food**: Instant game over - avoid at all costs!
- **Speed Bonus**: Game speed increases every 50 points

### Win/Loss Conditions
- **Game Over**: Eating poisonous food OR hitting your own body
- **Wall Collision**: Snake wraps around walls instead of dying
- **Goal**: Achieve the highest score possible

## 🕹️ Controls

| Key | Action |
|-----|--------|
| ↑ ↓ ← → | Move snake (arrow keys) |
| SPACE | Start game / Pause / Resume |
| R | Restart game (when game over) |

### Control Tips
- Cannot reverse direction directly (prevents accidental self-collision)
- Game auto-pauses when window loses focus
- Responsive controls with no input lag

## 🎨 Nokia-Style Design

### Visual Features
- **Monochrome Green Display**: Authentic Nokia 3310 color scheme
- **Pixelated Graphics**: Crisp, blocky sprites with pixel-perfect rendering
- **Classic Typography**: JetBrains Mono font for authentic feel
- **Subtle Animations**: Pulsing poisonous food and glow effects
- **Retro Border**: Classic Nokia device frame styling

### Technical Implementation
- HTML5 Canvas with optimized rendering
- 20x20 grid system (400x400 pixels)
- Anti-aliasing disabled for sharp pixels
- 60fps animation loop with deltaTime calculations

## 🚀 How to Play

1. **Start**: Open `index.html` in a web browser
2. **Begin**: Press SPACE to start the game
3. **Move**: Use arrow keys to control your snake
4. **Eat**: Consume green food to grow and increase score
5. **Avoid**: Stay away from red poisonous food
6. **Survive**: Don't hit your own body
7. **Wrap**: Use wall wrapping strategically for tight escapes

## 🛠️ Technical Details

### Performance Optimizations
- RequestAnimationFrame for smooth 60fps
- Efficient collision detection algorithms
- Minimal DOM manipulations
- Optimized canvas rendering

### Browser Compatibility
- Modern browsers with HTML5 Canvas support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile responsive design
- Touch-friendly interface

### File Structure
```
snake-game/
├── index.html      # Main game page
├── style.css       # Nokia-style CSS
├── script.js       # Complete game logic
└── README.md       # This file
```

## 🎪 Advanced Strategies

### Wall Wrapping Tactics
- Use walls to escape tight situations
- Plan routes using wrap-around mechanics
- Corner cutting for efficient movement

### Poisonous Food Management
- Poisonous food appears randomly (not always)
- Higher levels = higher poisonous food spawn chance
- Clear poisonous food by eating normal food

### High Score Tips
- Focus on consistent, safe movement patterns
- Use the entire play area efficiently
- Take advantage of wall wrapping for longer survival
- Risk/reward decisions with poisonous food placement

## 🏆 Achievement Levels

| Score | Achievement | Speed Level |
|-------|-------------|-------------|
| 50 | Snake Rookie | Level 2 |
| 100 | Wall Walker | Level 3 |
| 200 | Poison Dodger | Level 5 |
| 300 | Nokia Master | Level 7 |
| 500+ | Snake Legend | Level 10+ |

## 🔧 Customization

The game is built with modular code allowing easy customization:

- **Grid Size**: Modify `GRID_SIZE` constant
- **Speed**: Adjust `INITIAL_SPEED` and `SPEED_INCREASE`
- **Colors**: Change `COLORS` object for different themes
- **Food Spawn Rate**: Modify `poisonousFoodChance` variable

## 📱 Mobile Support

- Responsive design adapts to mobile screens
- Touch-friendly interface elements
- Optimized for both portrait and landscape
- Maintains aspect ratio across devices

## 🐛 Known Features

- High score persists between sessions
- Auto-pause on window focus loss
- Prevents accidental direction reversal
- Smooth wall transitions with no visual glitches

---

**Built with passion for classic gaming and modern web technology.**

*Experience the nostalgia of Nokia Snake with enhanced gameplay mechanics that add depth while preserving the beloved simplicity of the original.*