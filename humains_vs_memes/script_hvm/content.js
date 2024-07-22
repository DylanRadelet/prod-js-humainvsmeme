// content.js

const images = [];
const enemyImages = [];
const projectileImage = new Image();
const explosionImage = new Image();
projectileImage.src = './assets_hvm/images/projectile/projectile.png'; 
explosionImage.src = './assets_hvm/images/explosion.png'; 
const imageSrcs = [
    './assets_hvm/images/humain/humain-01.webp', 
    './assets_hvm/images/humain/humain-02.webp', 
    './assets_hvm/images/humain/humain-03.webp'
];
const enemyImageSrcs = [
    './assets_hvm/images/meme/mechant/mechant-meme-01.png',
    './assets_hvm/images/meme/mechant/mechant-meme-02.png',
    './assets_hvm/images/meme/mechant/mechant-meme-03.png',
    './assets_hvm/images/meme/mechant/mechant-meme-04.png',
    './assets_hvm/images/meme/mechant/mechant-meme-05.png',
    './assets_hvm/images/meme/mechant/mechant-meme-06.png',
    './assets_hvm/images/meme/mechant/mechant-meme-07.png',
    './assets_hvm/images/meme/mechant/mechant-meme-08.png',
    './assets_hvm/images/meme/mechant/mechant-meme-09.png',
    './assets_hvm/images/meme/mechant/mechant-meme-10.png',
    './assets_hvm/images/meme/mechant/mechant-meme-11.png',
    './assets_hvm/images/meme/mechant/mechant-meme-12.png'
];
const bossImages = [
    './assets_hvm/images/meme/boss/boss-meme-01.webp',
    './assets_hvm/images/meme/boss/boss-meme-02.webp',
    './assets_hvm/images/meme/boss/boss-meme-03.webp'
];
const bosses = [];
const bossProjectiles = [];
let currentBoss = null;
let bossActive = false;
let bossSpawnDistance = 1000; 

const imageRects = [];
let selectedImageIndex = 0;  
let imagesLoaded = 0;  
let explosion = null;

// Charger les images des personnages
imageSrcs.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        images[index] = img;
        imagesLoaded++;
        console.log(`Image ${index} loaded from ${src}`);
        if (imagesLoaded === imageSrcs.length) {
            drawCharacterContent();  
        }
    };
    img.onerror = () => {
        console.error(`Error loading image at ${src}`);
    };
});

// Charger les images des ennemis
enemyImageSrcs.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        enemyImages[index] = img;
        console.log(`Enemy Image ${index} loaded from ${src}`);
    };
    img.onerror = () => {
        console.error(`Error loading enemy image at ${src}`);
    };
});

// Récupérer le personnage sélectionné depuis le stockage local
function loadSelectedCharacter() {
    const savedIndex = localStorage.getItem('selectedCharacterIndex');
    if (savedIndex !== null) {
        selectedImageIndex = parseInt(savedIndex, 10);
        updateMenuIcon();
    }
}

// Sauvegarder le personnage sélectionné dans le stockage local
function saveSelectedCharacter(index) {
    localStorage.setItem('selectedCharacterIndex', index);
}

function drawInventoryContent() {
    console.log("drawInventoryContent called");
    context.clearRect(0, 0, canvas.width, canvas.height);  // Efface le canvas
    context.fillStyle = '#000000';
    context.font = '20px Arial';
    context.fillText('Inventaire', 60, 100);

    // Dessiner les items de l'inventaire (exemple)
    // Vous pouvez ajouter ici la logique pour afficher les items de l'inventaire

    drawBackButton();  // Dessine le bouton retour sous forme de croix
}

// Fonction pour dessiner le contenu du mode 'character'
function drawCharacterContent() {
    console.log("drawCharacterContent called");
    context.clearRect(0, 0, canvas.width, canvas.height);  // Efface le canvas
    context.fillStyle = '#000000';
    context.font = '20px Arial';
    context.fillText('Choix du personnage'.toUpperCase(), 60, 100);

    // Dessiner les images dans des carrés
    const squareSize = 120;
    const gap = 20;
    const totalHeight = (squareSize + gap) * images.length - gap;
    const startX = (canvas.width - squareSize) / 2; 
    const startY = (canvas.height - totalHeight) / 2; 
    for (let i = 0; i < images.length; i++) {
        const x = startX;
        const y = startY + i * (squareSize + gap);
        if (images[i]) {
            context.drawImage(images[i], x, y, squareSize, squareSize);
        }
        imageRects[i] = { x, y, width: squareSize, height: squareSize };

        if (i === selectedImageIndex) {
            context.strokeStyle = '#FFD700';
            context.lineWidth = 5;
            context.strokeRect(x, y, squareSize, squareSize);
        }
    }
}

// Gestion du survol et du clic pour sélectionner une image
canvas.addEventListener('mousemove', (event) => {
    if (currentMode !== 'character') return; // Ne rien faire si on n'est pas en mode 'character'
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    let hovering = false;
    for (let i = 0; i < imageRects.length; i++) {
        const { x, y, width, height } = imageRects[i];
        if (mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height) {
            canvas.style.cursor = 'pointer';
            hovering = true;
            break;
        }
    }

    if (!hovering) {
        canvas.style.cursor = 'default';
    }
});

canvas.addEventListener('click', (event) => {
    if (currentMode !== 'character') return; // Ne rien faire si on n'est pas en mode 'character'
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (let i = 0; i < imageRects.length; i++) {
        const { x, y, width, height } = imageRects[i];
        if (mouseX >= x && mouseX <= x + width && mouseY >= y && mouseY <= y + height) {
            selectedImageIndex = i;  // Sauvegarder l'indice de l'image sélectionnée
            saveSelectedCharacter(i);  // Sauvegarder dans le stockage local
            updateMenuIcon();
            drawCharacterContent();  // Redessiner le contenu pour mettre à jour la bordure de sélection
            break;
        }
    }
});

// Fonction pour mettre à jour l'icône dans le menu principal
function updateMenuIcon() {
    const menuIcon = document.getElementById('menuIcon');
    if (images[selectedImageIndex]) {
        menuIcon.src = images[selectedImageIndex].src;
        menuIcon.style.border = '2px solid #000000';
        menuIcon.style.width = '75px';
        menuIcon.style.height = '75px';
    }
}

// Charger le personnage sélectionné au chargement de la page
window.addEventListener('load', loadSelectedCharacter);

// Fonction pour dessiner le contenu du mode 'play'
const distanceLogInterval = 100;
let lastLoggedDistance = 0;

function drawPlayContent() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    context.font = '20px Arial';

    // Dessiner le joueur avec l'image sélectionnée
    const playerImage = images[selectedImageIndex];
    if (playerImage) {
        context.drawImage(playerImage, player.x, player.y, player.width, player.height);
    }

    // Dessiner les projectiles
    projectiles.forEach((proj, index) => {
        proj.width = 24;
        proj.height = 24;
        proj.y -= 5;
        if (projectileImage.complete) {
            context.drawImage(projectileImage, proj.x - 12, proj.y, proj.width, proj.height);
        } else {
            context.fillStyle = '#FF0000';
            context.fillRect(proj.x, proj.y, proj.width, proj.height);
        }
        if (proj.y < 0) {
            projectiles.splice(index, 1);
        }
    });

    // Ajuster la probabilité d'apparition des ennemis et leur vie
    adjustSpawnProbability();
    adjustEnemyHealth();

    // Ajouter des ennemis en fonction de la probabilité ajustée
    spawnEnemy();

    // Dessiner les ennemis
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.image) {
            context.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
        } else {
            context.fillStyle = '#00FF00';
            context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }

        // Détecter les collisions avec les projectiles
        projectiles.forEach((proj, pIndex) => {
            if (
                proj.x < enemy.x + enemy.width &&
                proj.x + proj.width > enemy.x &&
                proj.y < enemy.y + enemy.height &&
                proj.height + proj.y > enemy.y
            ) {
                projectiles.splice(pIndex, 1);
                enemy.health--;
                if (enemy.health <= 0) {
                    explosion = { x: enemy.x, y: enemy.y, startTime: Date.now() }; // Ajouter l'explosion
                    enemies.splice(index, 1); // Supprimer l'ennemi immédiatement

                    // Calculer le multiplicateur de score
                    const multiplier = getScoreMultiplier(previousDistance);
                    score += 1 * multiplier; // Appliquer le multiplicateur au score

                    paperBalls++;
                    totalMonstersKilled++;
                    totalPaperBalls++;
                    updateStats();
                }
            }
        });

        // Détecter les collisions avec le joueur
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.height + player.y > enemy.y
        ) {
            enemies.splice(index, 1);
            player.lives--;
            if (player.lives <= 0) {
                showGameOver();
            }
        }

        // Supprimer les ennemis qui sortent de l'écran
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });

    // Dessiner l'explosion avec effet de fondu
    if (explosion) {
        const currentTime = Date.now();
        const elapsed = currentTime - explosion.startTime;
        const fadeDuration = 700; // Durée totale de l'explosion en ms
        if (elapsed < fadeDuration) {
            context.globalAlpha = 1 - elapsed / fadeDuration; // Réduire l'opacité au fil du temps
            context.drawImage(explosionImage, explosion.x, explosion.y, 50, 50); // Dessiner l'explosion
            context.globalAlpha = 1.0; // Réinitialiser l'opacité
        } else {
            explosion = null; // Réinitialiser l'explosion après la durée de fondu
        }
    }

    // Afficher les vies et le score
    context.fillStyle = '#000000';
    context.fillText(`Vies: ${player.lives}`, 10, 80);
    context.fillText(`Score: ${score.toFixed(2)}`, 10, 100); // Afficher le score avec deux décimales
    context.fillText(`Boulette: ${paperBalls}`, 10, 120);

    // Incrémenter la durée du jeu et ajuster la vitesse et la probabilité d'apparition des ennemis
    gameDuration += 1;
    if (gameDuration % speedIncrementInterval === 0) {
        enemySpeed += speedIncrement;
    }

    // Mettre à jour la distance
    const distance = Math.floor(gameDuration * enemySpeed); // /5
    if (distance > previousDistance) {
        previousDistance = distance;
        document.getElementById('distance-max').textContent = previousDistance;
        saveStats(); // Sauvegarder la distance si elle est plus grande
    }
}

function getScoreMultiplier(distance) {
    return 1 + Math.floor(distance / 200) * 0.1;
}

function adjustSpawnProbability() {
    const distance = gameDuration * enemySpeed;

    if (distance < 1000) {
        enemiesPerCycle = 1;
        spawnInterval = 100;
    } else if (distance < 2000) {
        enemiesPerCycle = 2;
        spawnInterval = 100;
    } else if (distance < 3000) {
        enemiesPerCycle = 3;
        spawnInterval = 100;
    } else if (distance < 4000) {
        enemiesPerCycle = 4;
        spawnInterval = 100;
    } else if (distance < 5000) {
        enemiesPerCycle = 5;
        spawnInterval = 100;
    } else if (distance < 6000) {
        enemiesPerCycle = 6;
        spawnInterval = 100;
    } else {
        enemiesPerCycle = 7;
        spawnInterval = 8;
    }
}

function adjustEnemyHealth() {
    const distance = gameDuration * enemySpeed;

    if (distance < 1000) {
        enemyHealth = 1;
    } else if (distance < 2000) {
        enemyHealth = 2;
    } else if (distance < 3000) {
        enemyHealth = 3;
    } else if (distance < 4000) {
        enemyHealth = 4;
    } else if (distance < 5000) {
        enemyHealth = 5;
    } else if (distance < 6000) {
        enemyHealth = 6;
    } else {
        enemyHealth = 7;
    }
}

function getRandomSpawnProbability(min, max) {
    const framesPerSecond = 60;  
    const minFrameInterval = framesPerSecond * min;
    const maxFrameInterval = framesPerSecond * max;
    return 1 / (Math.random() * (maxFrameInterval - minFrameInterval) + minFrameInterval);
}

function spawnEnemy() {
    if (gameDuration % spawnInterval === 0) {
        for (let i = 0; i < enemiesPerCycle; i++) {
            const enemyWidth = 50;
            const enemyHeight = 50;
            const x = Math.random() * (canvas.width - enemyWidth);  // Position x aléatoire sur la largeur de l'écran
            const y = -enemyHeight;
            const imageIndex = (i + gameDuration / spawnInterval) % enemyImages.length; // Utiliser différents indices d'image
            const image = enemyImages[imageIndex];
            enemies.push({ x, y, width: enemyWidth, height: enemyHeight, health: enemyHealth, image });
            console.log("Enemy spawned at:", x, y, "with image index:", imageIndex, "and health:", enemyHealth);
        }
    }
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
    localStorage.setItem('score', score); // Ajouter cette ligne pour sauvegarder le score
}

// Fonction pour charger les statistiques depuis le stockage local
function loadStats() {
    totalMonstersKilled = parseInt(localStorage.getItem('totalMonstersKilled'), 10) || 0;
    totalPaperBalls = parseInt(localStorage.getItem('totalPaperBalls'), 10) || 0;
    previousDistance = parseInt(localStorage.getItem('distanceMax'), 10) || 0;
    score = parseFloat(localStorage.getItem('score')) || 0; // Ajouter cette ligne pour charger le score
    updateStats();
}

// Charger les statistiques au chargement de la page
window.addEventListener('load', loadStats);
