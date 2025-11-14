const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player
const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    width: 30,
    height: 10,
    color: 'green',
    dx: 5
};

// Bullets
let bullets = [];
const bullet = {
    width: 3,
    height: 10,
    color: 'white',
    dy: -7
};

// Enemies
let enemies = [];
const enemy = {
    width: 20,
    height: 20,
    color: 'red',
    dx: 2,
    dy: 20
};

let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ') {
        shoot();
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function createEnemies() {
    enemies = [];
    for (let c = 0; c < 5; c++) {
        for (let r = 0; r < 3; r++) {
            enemies.push({
                x: c * (enemy.width + 20) + 60,
                y: r * (enemy.height + 20) + 30,
                width: enemy.width,
                height: enemy.height,
                color: enemy.color,
                dx: enemy.dx
            });
        }
    }
}

function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - bullet.width / 2,
        y: player.y,
        width: bullet.width,
        height: bullet.height,
        color: bullet.color,
        dy: bullet.dy
    });
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
    bullets.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });
}

function drawEnemies() {
    enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });
}

function update() {
    // Move player
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.dx;
    } else if (leftPressed && player.x > 0) {
        player.x -= player.dx;
    }

    // Move bullets
    bullets.forEach((b, i) => {
        b.y += b.dy;
        if (b.y < 0) {
            bullets.splice(i, 1);
        }
    });

    // Move enemies
    let edge = false;
    enemies.forEach(e => {
        e.x += e.dx;
        if (e.x + e.width > canvas.width || e.x < 0) {
            edge = true;
        }
    });

    if (edge) {
        enemies.forEach(e => {
            e.dx *= -1;
            e.y += enemy.dy;
        });
    }

    // Collision detection
    bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
            if (b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y) {
                bullets.splice(bi, 1);
                enemies.splice(ei, 1);
            }
        });
    });

    // Game over
    enemies.forEach(e => {
        if (e.y + e.height > player.y) {
            alert('ゲームオーバー');
            document.location.reload();
        }
    });

    if (enemies.length === 0) {
        alert('クリア！');
        document.location.reload();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

createEnemies();
gameLoop();
