// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.setProperties(true);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};
// Update the enemy's position, required method for game
// random generator 
function ranGen(low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
}
Enemy.prototype.setProperties = function(init) {
    // Enemies run speed: Speed can be changed by chaning multiplier
    var speed = ranGen(1, 3) * 100;
    if (init) {
        this.x = ranGen(-404, 404);
        this.speed = speed;
    } else {
        this.x = ranGen(-404, -101);
        this.speed = speed;
    }
    // collision detection with enemy
    this.row = ranGen(1, 3);
    this.y = this.row * 83 - 12;
};
// Update the enemy's position and check for collisions.
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for all computers.
    if (!game.pause) {
        this.x > 505 ? this.setProperties(false) : this.x += this.speed * dt;
        // Collision detection for player 
        if (this.row === game.player.row) {
            if (this.x > game.player.x - 73 && this.x < game.player.x + 73) {
                game.player.dead();
            }
        }
    }
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// PLAYER CLASS//
var Player = function(lives, col, row) {
    // Player properties:
    this.col = col;
    this.row = row;
    this.score = 0;
    this.lives = lives;
    // set Player image.
    this.sprite = 'images/char-pink-girl.png';
};
// Draws the player on the screen.required method for game
Player.prototype.render = function() {
    this.x = this.col * 101;
    this.y = this.row * 83 - 10;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Resets  position of the player.
Player.prototype.reset = function() {
    game.pause = false;
    this.col = 2;
    this.row = 5;
};
// score and game reset.
Player.prototype.goal = function() {
    this.row = 0;
    window.setTimeout(function() {
        // Resets all enemies 
        game.allEnemies.forEach(function(elem, index) {
            elem.setProperties(true);
        });
        // Player position reset
        game.player.score++;
        game.player.reset();
    }, 100);
};
// End of life handling of player
Player.prototype.dead = function() {
    this.lives--;
    this.lives > 0 ? this.reset() : game.end();
};
// keyboard input for player.
Player.prototype.handleInput = function(key) {
    if (!game.pause) {
        switch (key) {
            //  player movement inside of the canvas control
            case 'right':
                this.col != 4 ? this.col += 1 : this.col = 4;
                break;
            case 'left':
                this.col !== 0 ? this.col -= 1 : this.col = 0;
                break;
            case 'up':
                this.row != 1 ? this.row -= 1 : this.goal();
                break;
            case 'down':
                this.row != 5 ? this.row += 1 : this.row = 5;
                break;
            default:
                break;
        }
    }
};
// Define extra class for additional resources
var Game = function(enemies, first) {
    // Set game state paused in initial start
    this.pause = true;
    // Sets the current state of the game to 'game over'
    this.over = false;
    // Initialization for first game
    this.first = first;
    // Set all enemies
    this.allEnemies = [];
    // Update all enemies in array
    for (var i = 0; i < enemies; i++) {
        this.allEnemies.push(new Enemy());
    }
    // Initializing a player.
    this.player = new Player(3, 2, 5);
};
// After the game is over, the player is paused and moved to initial location.
Game.prototype.end = function() {
    game.pause = true;
    this.player.col = 2;
    this.player.row = 5;
    game.over = true;
};
// Set keyboard input.
Game.prototype.handleInput = function(key) {
    switch (key) {
        // space key is used to pause and unpause the game
        case 'space':
            // Switch between pause on and off.
            game.pause = !game.pause;
            // Initializing the first game
            if (game.first) {
                game.first = false;
            }
            // pressing space starts a new game when game is over
            if (game.over) {
                game.over = false;
                game = new Game(numEnemies, false);
            }
            break;
    }
};
// Set the number of enemies 
var numEnemies = 5;
// Initialization of the first game.
var game = new Game(numEnemies, true);
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// Set key strokes to run the game
document.addEventListener('keyup', function(e) {
    // Setting keystrokes to run the game
    var gameKey = {
        32: 'space'
    };
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    // Set game and player controller
    e.keyCode > 32 ? game.player.handleInput(allowedKeys[e.keyCode]) : game.handleInput(gameKey[e.keyCode]);
});
//Game score function
function scoreText(ctx, txt, font, color, x, y) {
    // Saving the state of the game before moving next
    ctx.save();
    // Font, color and text set up
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(txt, x, y);
    // Restore the game
    ctx.restore();
}