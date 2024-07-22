// utils.js

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const menu = document.getElementById('menu');
const playButton = document.getElementById('playButton');
const characterButton = document.getElementById('characterButton');
const inventoryButton = document.getElementById('inventoryButton');
const confirmModal = document.getElementById('confirmModal');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
const speedIncrementInterval = 1000;
const speedIncrement = 0.1;
const spawnIncrementInterval = 1000;
const spawnIncrement = 0.001;
const ColorBackBTN = "#C2C2C2";
const ColorTXT = "#000000";

let currentMode = 'menu';
let backButton = { x: 10, y: 25, size: 20 };
let gameLoopId;

// Variables de jeu
let projectiles = [];
let enemies = [];
let enemySpeed = 0.5;
let spawnProbability = 0.01;
let gameDuration = 0;
let score = 0;
let paperBalls = 0;
let multiplicateurPaperBalls = 1;
let achatDeLaVie = 0;
let player = { x: canvas.width / 2 - 50, y: canvas.height - 200, width: 100, height: 100, lives: 5+achatDeLaVie };

let totalPaperBalls = 0;
let totalMonstersKilled = 0;

function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 10;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function showMenu() {
    console.log("Show menu");
    stopGameLoop();
    updateMenuStats();
    menu.style.display = 'flex';
    canvas.style.display = 'none';
    currentMode = 'menu';
}

// Fonction pour afficher le canvas
function showCanvas() {
    console.log("Show canvas");
    menu.style.display = 'none';
    canvas.style.display = 'block';
    resizeCanvas();
}

// Fonction pour gérer les déplacements du joueur
function movePlayer(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    player.x = mouseX - player.width / 2;
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
}

// Fonction pour gérer les déplacements tactiles du joueur
function movePlayerTouch(event) {
    const rect = canvas.getBoundingClientRect();
    const touchX = event.touches[0].clientX - rect.left;

    if (touchX > 0 && touchX < canvas.width - player.width) {
        player.x = touchX;
    }
}

// Fonction pour tirer des projectiles
function shootProjectile(event) {
    projectiles.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10 });
}

// Fonction pour tirer des projectiles avec un toucher
function shootProjectileTouch(event) {
    projectiles.push({ x: player.x + player.width / 2 - 2.5, y: player.y, width: 5, height: 10 });
}

// Ajoutez des écouteurs d'événements pour les mouvements de la souris et les clics
canvas.addEventListener('mousemove', movePlayer);
canvas.addEventListener('click', shootProjectile);

// Ajoutez des écouteurs d'événements pour les touches tactiles
canvas.addEventListener('touchmove', (event) => {
    event.preventDefault();
    movePlayerTouch(event);
}, { passive: false });

canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    shootProjectileTouch(event);
}, { passive: false });

// Fonction pour dessiner la croix de retour sur le canvas
function drawBackButton() {
    const { x, y, size } = backButton;
    context.strokeStyle = '#FF0000';
    context.lineWidth = 4;

    // Dessiner la croix
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + size, y + size);
    context.moveTo(x + size, y);
    context.lineTo(x, y + size);
    context.stroke();
}

// Gestion du clic sur la croix de retour
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const { x, y, size } = backButton;

    if (mouseX >= x && mouseX <= x + size && mouseY >= y && mouseY <= y + size) {
        pauseGame();
        showModal();
    }
});

let gameOver = false;

function showGameOver() {
    gameOver = true;
    context.fillStyle = '#FF0000';
    context.font = 'bold 50px Arial';
    context.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);

    document.addEventListener('keydown', handleGameOverKey);
}

function handleGameOverKey(event) {
    if (event.code === 'Space') {
        document.removeEventListener('keydown', handleGameOverKey);
        showMenu();
        resetGame();
    }
}

function pauseGame() {
    stopGameLoop();
}

function resumeGame() {
    gameLoop();
}

function showModal() {
    confirmModal.style.display = 'block';
}

function hideModal() {
    confirmModal.style.display = 'none';
}

confirmYes.addEventListener('click', () => {
    hideModal();
    showMenu();
    resetGame();
});

confirmNo.addEventListener('click', () => {
    hideModal();
    resumeGame();
});

function stopGameLoop() {
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
        gameLoopId = null;
    }
}

function gameLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);  

    if (currentMode === 'play') {
        if (!gameStarted) {
            drawCountdown();
        } else if (!gameOver) {  
            drawPlayContent();
        }
    } else if (currentMode === 'character') {
        drawCharacterContent();
    } else if (currentMode === 'inventory') {
        drawInventoryContent();
    }

    if (currentMode !== 'menu') {
        drawBackButton();  
    }

    if (!gameOver) {  
        gameLoopId = requestAnimationFrame(gameLoop);  
    }
}

function drawCountdown() {
    context.fillStyle = '#000000';
    context.font = 'bold 50px Arial';
    context.fillText(countdown, canvas.width / 2 - 15, canvas.height / 2);
}

function startGameAfterCountdown() {
    const countdownInterval = setInterval(() => {
        if (countdown > 1) {
            countdown--;
        } else {
            clearInterval(countdownInterval);
            gameStarted = true;
        }
    }, 1000);
}

// Fonction pour réinitialiser le jeu
function resetGame() {
    gameOver = false;
    gameStarted = false;
    countdown = 3;
    player.lives = 5;
    player.x = canvas.width / 2 - player.width / 2;
    player.y = canvas.height - player.height - 10;
    projectiles = [];
    enemies = [];
    score = 0;
    paperBalls = 0;
    gameDuration = 0;
    enemySpeed = 0.5;
    spawnProbability = 0.01;
}

// Fonction pour mettre à jour les statistiques dans le menu
function updateMenuStats() {
    document.getElementById('distance-max').textContent = previousDistance;
    document.getElementById('meme-kill').textContent = totalMonstersKilled;
    document.getElementById('boulette-papier').textContent = totalPaperBalls;
}

// Fonction pour mettre à jour les statistiques dans le menu
function updateStats() {
    document.getElementById('distance-max').textContent = previousDistance;
    document.getElementById('meme-kill').textContent = totalMonstersKilled; 
    document.getElementById('boulette-papier').textContent = totalPaperBalls;
    saveStats();
}

// Fonction pour sauvegarder les statistiques dans le stockage local
function saveStats() {
    localStorage.setItem('totalMonstersKilled', totalMonstersKilled);
    localStorage.setItem('totalPaperBalls', totalPaperBalls);
    localStorage.setItem('distanceMax', previousDistance);
}

// Fonction pour charger les statistiques depuis le stockage local
function loadStats() {
    totalMonstersKilled = parseInt(localStorage.getItem('totalMonstersKilled'), 10) || 0;
    totalPaperBalls = parseInt(localStorage.getItem('totalPaperBalls'), 10) || 0;
    previousDistance = parseInt(localStorage.getItem('distanceMax'), 10) || 0;
    updateStats();
}

// Charger les statistiques au chargement de la page
window.addEventListener('load', loadStats);

// Écouteurs pour les boutons du menu
playButton.addEventListener('click', () => {
    console.log("Play button clicked");
    showCanvas();
    resetGame();
    currentMode = 'play';
    startGameAfterCountdown();
    gameLoop();
});

characterButton.addEventListener('click', () => {
    console.log("Character button clicked");
    showCanvas();
    currentMode = 'character';
    gameLoop();
});

inventoryButton.addEventListener('click', () => {
    console.log("Inventory button clicked");
    showCanvas();
    currentMode = 'inventory';
    gameLoop();
});

canvas.addEventListener('mousemove', (event) => {
    if (!gameOver) {
        movePlayer(event);
    }
});
canvas.addEventListener('click', (event) => {
    if (!gameOver) {
        shootProjectile(event);
    }
});

// Ajoutez des écouteurs d'événements pour les touches tactiles
canvas.addEventListener('touchmove', (event) => {
    if (!gameOver) {
        event.preventDefault();
        movePlayerTouch(event);
    }
}, { passive: false });

canvas.addEventListener('touchstart', (event) => {
    if (!gameOver) {
        event.preventDefault();
        shootProjectileTouch(event);
    }
}, { passive: false });
