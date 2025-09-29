// Nokia Snake Game - Advanced Edition with Wall Wrapping and Poisonous Food
// Enhanced classic Nokia experience with modern performance

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlay = document.getElementById('gameOverlay');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayMessage = document.getElementById('overlayMessage');
        
        // UI Elements
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.speedLevelElement = document.getElementById('speedLevel');
        this.snakeLengthElement = document.getElementById('snakeLength');
        
        // Game constants
        this.GRID_SIZE = 20;
        this.CANVAS_SIZE = 400;
        this.GRID_COUNT = this.CANVAS_SIZE / this.GRID_SIZE;
        this.INITIAL_SPEED = 150; // milliseconds
        this.SPEED_INCREASE = 10; // speed increase per level
        
        // Game colors (Nokia green theme)
        this.COLORS = {
            BACKGROUND: '#000000',
            SNAKE: '#00ff00',
            SNAKE_HEAD: '#44ff44',
            NORMAL_FOOD: '#00ff00',
            POISONOUS_FOOD: '#ff4444',
            GRID: '#001100'
        };
        
        // Game state
        this.gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameOver'
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
        this.speed = this.INITIAL_SPEED;
        this.level = 1;
        
        // Snake properties
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        
        // Food properties
        this.normalFood = null;
        this.poisonousFood = null;
        this.poisonousFoodChance = 0.4; // 40% base chance
        this.foodEaten = 0;
        
        // Animation and timing
        this.lastTime = 0;
        this.gameLoopId = null;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.updateUI();
        this.bindEvents();
        this.showMenu();
        this.generateNormalFood();
    }
    
    setupCanvas() {
        // Set up canvas for pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.fillStyle = this.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Prevent arrow keys from scrolling the page
        document.addEventListener('keydown', (e) => {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }
    
    handleKeyPress(event) {
        const key = event.code;
        
        switch (key) {
            case 'Space':
                event.preventDefault();
                this.togglePause();
                break;
            case 'KeyR':
                if (this.gameState === 'gameOver' || this.gameState === 'menu') {
                    this.restart();
                }
                break;
            case 'ArrowUp':
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (this.direction.x === 0) {
                    this.nextDirection = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (this.direction.x === 0) {
                    this.nextDirection = { x: 1, y: 0 };
                }
                break;
        }
    }
    
    togglePause() {
        if (this.gameState === 'menu') {
            this.startGame();
        } else if (this.gameState === 'playing') {
            this.pauseGame();
        } else if (this.gameState === 'paused') {
            this.resumeGame();
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.hideOverlay();
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.gameLoop();
    }
    
    pauseGame() {
        this.gameState = 'paused';
        this.showOverlay('PAUSED', 'Press SPACE to resume');
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }
    }
    
    resumeGame() {
        this.gameState = 'playing';
        this.hideOverlay();
        this.gameLoop();
    }
    
    restart() {
        // Reset game state
        this.gameState = 'playing';
        this.score = 0;
        this.speed = this.INITIAL_SPEED;
        this.level = 1;
        this.foodEaten = 0;
        
        // Reset snake
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        // Reset food
        this.normalFood = null;
        this.poisonousFood = null;
        this.generateNormalFood();
        
        this.updateUI();
        this.hideOverlay();
        this.gameLoop();
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState !== 'playing') return;
        
        const deltaTime = currentTime - this.lastTime;
        
        if (deltaTime >= this.speed) {
            this.update();
            this.render();
            this.lastTime = currentTime;
        }
        
        this.gameLoopId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update() {
        // Update direction
        this.direction = { ...this.nextDirection };
        
        // Move snake
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Wall wrapping mechanics
        head.x = this.wrapCoordinate(head.x);
        head.y = this.wrapCoordinate(head.y);
        
        // Check self collision
        if (this.checkSelfCollision(head)) {
            this.gameOver('Ouch! You bit yourself!');
            return;
        }
        
        // Add new head
        this.snake.unshift(head);
        
        // Check food collisions
        if (this.checkFoodCollision(head, this.normalFood)) {
            this.eatNormalFood();
        } else if (this.poisonousFood && this.checkFoodCollision(head, this.poisonousFood)) {
            this.eatPoisonousFood();
            return;
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
        
        this.updateUI();
    }
    
    wrapCoordinate(coord) {
        if (coord < 0) {
            return this.GRID_COUNT - 1;
        } else if (coord >= this.GRID_COUNT) {
            return 0;
        }
        return coord;
    }
    
    checkSelfCollision(head) {
        return this.snake.some(segment => 
            segment.x === head.x && segment.y === head.y
        );
    }
    
    checkFoodCollision(head, food) {
        return food && head.x === food.x && head.y === food.y;
    }
    
    eatNormalFood() {
        this.score += 10;
        this.foodEaten++;
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore.toString());
        }
        
        // Increase speed every 50 points
        if (this.score % 50 === 0) {
            this.level++;
            this.speed = Math.max(80, this.INITIAL_SPEED - (this.level - 1) * this.SPEED_INCREASE);
        }
        
        // Generate new normal food
        this.generateNormalFood();
        
        // Handle poisonous food
        this.handlePoisonousFood();
    }
    
    eatPoisonousFood() {
        this.gameOver('Poisoned! Red food is deadly!');
    }
    
    handlePoisonousFood() {
        // Remove existing poisonous food when normal food is eaten
        this.poisonousFood = null;
        
        // Random chance to spawn poisonous food (30-50% based on difficulty)
        const chance = this.poisonousFoodChance + (this.level - 1) * 0.02;
        const shouldSpawn = Math.random() < Math.min(chance, 0.5);
        
        if (shouldSpawn) {
            this.generatePoisonousFood();
        }
    }
    
    generateNormalFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.GRID_COUNT),
                y: Math.floor(Math.random() * this.GRID_COUNT)
            };
        } while (this.isPositionOccupied(food));
        
        this.normalFood = food;
    }
    
    generatePoisonousFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.GRID_COUNT),
                y: Math.floor(Math.random() * this.GRID_COUNT)
            };
        } while (this.isPositionOccupied(food));
        
        this.poisonousFood = food;
    }
    
    isPositionOccupied(pos) {
        // Check if position is occupied by snake
        const onSnake = this.snake.some(segment => 
            segment.x === pos.x && segment.y === pos.y
        );
        
        // Check if position is occupied by normal food
        const onNormalFood = this.normalFood && 
            this.normalFood.x === pos.x && this.normalFood.y === pos.y;
        
        // Check if position is occupied by poisonous food
        const onPoisonousFood = this.poisonousFood && 
            this.poisonousFood.x === pos.x && this.poisonousFood.y === pos.y;
        
        return onSnake || onNormalFood || onPoisonousFood;
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = this.COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
        
        // Draw subtle grid (Nokia style)
        this.drawGrid();
        
        // Draw food
        this.drawFood();
        
        // Draw snake
        this.drawSnake();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = this.COLORS.GRID;
        this.ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x <= this.GRID_COUNT; x++) {
            const posX = x * this.GRID_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(posX, 0);
            this.ctx.lineTo(posX, this.CANVAS_SIZE);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= this.GRID_COUNT; y++) {
            const posY = y * this.GRID_SIZE;
            this.ctx.beginPath();
            this.ctx.moveTo(0, posY);
            this.ctx.lineTo(this.CANVAS_SIZE, posY);
            this.ctx.stroke();
        }
    }
    
    drawFood() {
        // Draw normal food
        if (this.normalFood) {
            this.ctx.fillStyle = this.COLORS.NORMAL_FOOD;
            this.drawPixelBlock(this.normalFood.x, this.normalFood.y);
        }
        
        // Draw poisonous food
        if (this.poisonousFood) {
            this.ctx.fillStyle = this.COLORS.POISONOUS_FOOD;
            this.drawPixelBlock(this.poisonousFood.x, this.poisonousFood.y);
            
            // Add pulsing effect to poisonous food
            const time = Date.now();
            const opacity = 0.7 + 0.3 * Math.sin(time * 0.008);
            this.ctx.globalAlpha = opacity;
            this.drawPixelBlock(this.poisonousFood.x, this.poisonousFood.y);
            this.ctx.globalAlpha = 1;
        }
    }
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Snake head - slightly brighter
                this.ctx.fillStyle = this.COLORS.SNAKE_HEAD;
            } else {
                // Snake body
                this.ctx.fillStyle = this.COLORS.SNAKE;
            }
            this.drawPixelBlock(segment.x, segment.y);
        });
    }
    
    drawPixelBlock(x, y) {
        const pixelX = x * this.GRID_SIZE + 1;
        const pixelY = y * this.GRID_SIZE + 1;
        const size = this.GRID_SIZE - 2;
        
        this.ctx.fillRect(pixelX, pixelY, size, size);
    }
    
    gameOver(message) {
        this.gameState = 'gameOver';
        if (this.gameLoopId) {
            cancelAnimationFrame(this.gameLoopId);
        }
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore.toString());
        }
        
        this.showOverlay('GAME OVER', message + '\nPress R to restart');
        this.updateUI();
        
        // Add pulse effect to game container
        document.querySelector('.game-container').classList.add('game-over');
        setTimeout(() => {
            document.querySelector('.game-container').classList.remove('game-over');
        }, 3000);
    }
    
    showMenu() {
        this.gameState = 'menu';
        this.showOverlay('NOKIA SNAKE', 'Enhanced Edition\nPress SPACE to start');
    }
    
    showOverlay(title, message) {
        this.overlayTitle.textContent = title;
        this.overlayMessage.textContent = message;
        this.overlay.classList.remove('hidden');
    }
    
    hideOverlay() {
        this.overlay.classList.add('hidden');
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.highScoreElement.textContent = this.highScore;
        this.speedLevelElement.textContent = this.level;
        this.snakeLengthElement.textContent = this.snake.length;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeGame();
    
    // Add some extra Nokia-style effects
    console.log('🐍 Nokia Snake Game - Enhanced Edition Loaded!');
    console.log('Features: Wall Wrapping, Poisonous Food, Progressive Speed');
    console.log('Controls: Arrow Keys, SPACE (pause), R (restart)');
});

// Prevent right-click context menu on canvas for full Nokia experience
document.getElementById('gameCanvas').addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Add focus management for better keyboard control
document.addEventListener('click', () => {
    document.body.focus();
});

// Ensure the game stays focused
window.addEventListener('blur', () => {
    // Auto-pause when window loses focus
    if (window.game && window.game.gameState === 'playing') {
        window.game.pauseGame();
    }
});