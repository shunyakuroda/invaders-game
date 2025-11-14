/**
 * @const {HTMLCanvasElement} canvas - ゲーム用のキャンバス要素。
 */
const canvas = document.getElementById('gameCanvas');
/**
 * @const {CanvasRenderingContext2D} ctx - キャンバスの2Dレンダリングコンテキスト。
 */
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');

/**
 * @typedef {object} Player
 * @property {number} x - プレイヤーのx座標。
 * @property {number} y - プレイヤーのy座標。
 * @property {number} width - プレイヤーの幅。
 * @property {number} height - プレイヤーの高さ。
 * @property {string} color - プレイヤーの色。
 * @property {number} dx - プレイヤーの水平移動速度。
 */

/**
 * プレイヤーオブジェクト。
 * @type {Player}
 */
const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 30,
    width: 30,
    height: 10,
    color: 'green',
    dx: 5
};

/**
 * @typedef {object} Bullet
 * @property {number} x - 弾のx座標。
 * @property {number} y - 弾のy座標。
 * @property {number} width - 弾の幅。
 * @property {number} height - 弾の高さ。
 * @property {string} color - 弾の色。
 * @property {number} dy - 弾の垂直移動速度。
 */

/**
 * すべての弾オブジェクトを格納する配列。
 * @type {Bullet[]}
 */
let bullets = [];
/**
 * 新しい弾を作成するためのテンプレートオブジェクト。
 * @type {object}
 * @property {number} width - 弾の幅。
 * @property {number} height - 弾の高さ。
 * @property {string} color - 弾の色。
 * @property {number} dy - 弾の垂直速度。
 */
const bullet = {
    width: 3,
    height: 10,
    color: 'white',
    dy: -7
};

/**
 * @typedef {object} Enemy
 * @property {number} x - 敵のx座標。
 * @property {number} y - 敵のy座標。
 * @property {number} width - 敵の幅。
 * @property {number} height - 敵の高さ。
 * @property {string} color - 敵の色。
 * @property {number} dx - 敵の水平移動速度。
 */

/**
 * すべての敵オブジェクトを格納する配列。
 * @type {Enemy[]}
 */
let enemies = [];
/**
 * 新しい敵を作成するためのテンプレートオブジェクト。
 * @type {object}
 * @property {number} width - 敵の幅。
 * @property {number} height - 敵の高さ。
 * @property {string} color - 敵の色。
 * @property {number} dx - 敵の水平速度。
 * @property {number} dy - 敵が端に当たったときに下に移動する垂直距離。
 */
const enemy = {
    width: 20,
    height: 20,
    color: 'red',
    dx: 2,
    dy: 20
};

/**
 * 右矢印キーが押されているかどうかを示すフラグ。
 * @type {boolean}
 */
let rightPressed = false;
/**
 * 左矢印キーが押されているかどうかを示すフラグ。
 * @type {boolean}
 */
let leftPressed = false;
let requestId;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
restartButton.addEventListener('click', () => {
    document.location.reload();
});

/**
 * keydownイベントを処理します。
 * @param {KeyboardEvent} e - キーボードイベントオブジェクト。
 */
function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.key === ' ') {
        shoot();
    }
}

/**
 * keyupイベントを処理します。
 * @param {KeyboardEvent} e - キーボードイベントオブジェクト。
 */
function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

/**
 * 敵のグリッドを作成します。
 */
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

/**
 * 新しい弾を作成し、bullets配列に追加します。
 */
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

/**
 * キャンバスにプレイヤーを描画します。
 */
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

/**
 * キャンバスにすべての弾を描画します。
 */
function drawBullets() {
    bullets.forEach(b => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
    });
}

/**
 * キャンバスにすべての敵を描画します。
 */
function drawEnemies() {
    enemies.forEach(e => {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.width, e.height);
    });
}

/**
 * フレームごとにゲームの状態を更新します。
 */
function update() {
    // プレイヤーを動かす
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.dx;
    } else if (leftPressed && player.x > 0) {
        player.x -= player.dx;
    }

    // 弾を動かす
    bullets.forEach((b, i) => {
        b.y += b.dy;
        if (b.y < 0) {
            bullets.splice(i, 1);
        }
    });

    // 敵を動かす
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

    // 衝突検出
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

    // ゲームオーバー
    enemies.forEach(e => {
        if (e.y + e.height > player.y) {
            alert('ゲームオーバー');
            document.location.reload();
        }
    });

    if (enemies.length === 0) {
        drawGameClearScreen();
        cancelAnimationFrame(requestId);
    }
}

/**
 * キャンバスをクリアし、すべてのゲームオブジェクトを描画します。
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
}

function drawGameClearScreen() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.fillText('ゲームクリア！', canvas.width / 2, canvas.height / 2);
    restartButton.style.display = 'block';
}

function gameLoop() {
    update();
    draw();
    requestId = requestAnimationFrame(gameLoop);
}

createEnemies();
gameLoop();
