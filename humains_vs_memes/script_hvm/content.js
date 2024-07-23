// content.js

const images = [];
const enemyImages = [];
const projectileImageBoss = new Image();
const projectileImage = new Image();
const explosionImage = new Image();
projectileImageBoss.src = './assets_hvm/images/projectile/chartreuse-verte.png'; 
projectileImage.src = './assets_hvm/images/projectile/projectile.png'; 
explosionImage.src = './assets_hvm/images/explosion.png'; 
const damageTexts = [];

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
    './assets_hvm/images/meme/boss/boss-meme-04.webp',
    './assets_hvm/images/meme/boss/boss-meme-03.webp'
];

const bosses = [];
let bossProjectiles = [];
let currentBoss = null;
let bossActive = false;
let bossSpawnDistance = 1000; 

const imageRects = [];
let selectedImageIndex = 0;  
let imagesLoaded = 0;  
let explosion = null;
let damageText = {
    text: '1000',
    x: 0,
    y: 0,
    startTime: 0,
    isActive: false
};

let lifeCost = 25;
let strengthCost = 100;
let multiplierCost = 50;

let projectileForce = 0;

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

function saveSelectedCharacter(index) {
    localStorage.setItem('selectedCharacterIndex', index);
}

function drawInventoryContent() {
    console.log("drawInventoryContent called");
    context.clearRect(0, 0, canvas.width, canvas.height); 
    context.fillStyle = '#000000';
    context.font = '30px Arial';
    context.fillText('Shop', 150, 100);

    drawInventoryButtons();

    drawBackButton();

    drawShowBoulettes();

}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

function drawShowBoulettes(){
    context.font = 'bold 16px Arial';
    context.fillText(`Vous avez ${totalPaperBalls} boulettes de papier`, 35, 600);
}

function drawInventoryButtons() {
    const buttonWidth = 200;
    const buttonHeight = 50;
    const buttonPadding = 20;
    const startX = (canvas.width - buttonWidth) / 2;
    const startY = 150;

    // Définir le rayon des coins arrondis
    const borderRadius = 10;

    // (Acheter de la vie)
    context.fillStyle = ColorBackBTN;
    roundRect(context, startX, startY, buttonWidth, buttonHeight, borderRadius, true, false);
    context.fillStyle = ColorTXT;
    context.font = '16px Arial';
    context.fillText(`Vie: ${lifeCost} bls`, startX + 10, startY + 30);

    // (Acheter de la force)
    context.fillStyle = ColorBackBTN;
    roundRect(context, startX, startY + buttonHeight + buttonPadding, buttonWidth, buttonHeight, borderRadius, true, false);
    context.fillStyle = ColorTXT;
    context.fillText(`Force: ${strengthCost} bls`, startX + 10, startY + buttonHeight + buttonPadding + 30);

    // (Acheter un multiplicateur boulette)
    context.fillStyle = ColorBackBTN;
    roundRect(context, startX, startY + (buttonHeight + buttonPadding) * 2, buttonWidth, buttonHeight, borderRadius, true, false);
    context.fillStyle = ColorTXT;
    context.fillText(`Multiplicateur: ${multiplierCost} bls`, startX + 10, startY + (buttonHeight + buttonPadding) * 2 + 30);
}

// Gestion des clics sur les boutons de l'inventaire
canvas.addEventListener('click', (event) => {
    if (currentMode !== 'inventory') return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonPadding = 20;
    const startX = (canvas.width - buttonWidth) / 2;
    const startY = 150;

    if (mouseX >= startX && mouseX <= startX + buttonWidth && mouseY >= startY && mouseY <= startY + buttonHeight) {
        if (totalPaperBalls >= lifeCost) {
            totalPaperBalls -= lifeCost;
            achatDeLaVie += 1;
            lifeCost = Math.floor(lifeCost * 5.5);
            updateStats();
            drawInventoryContent();
            saveCosts();
        }
    }

    if (mouseX >= startX && mouseX <= startX + buttonWidth && mouseY >= startY + buttonHeight + buttonPadding && mouseY <= startY + buttonHeight + buttonPadding + buttonHeight) {
        if (totalPaperBalls >= strengthCost) {
            totalPaperBalls -= strengthCost;
            projectileForce += 1;
            strengthCost = Math.floor(strengthCost * 10.5);
            updateStats();
            drawInventoryContent();
            saveCosts();
        }
    }

    if (mouseX >= startX && mouseX <= startX + buttonWidth && mouseY >= startY + (buttonHeight + buttonPadding) * 2 && mouseY <= startY + (buttonHeight + buttonPadding) * 2 + buttonHeight) {
        if (totalPaperBalls >= multiplierCost) {
            totalPaperBalls -= multiplierCost;
            multiplicateurPaperBalls += 1;
            multiplierCost = Math.floor(multiplierCost * 15.5);
            updateStats();
            drawInventoryContent();
            saveCosts(); 
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (currentMode !== 'inventory') return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonPadding = 20;
    const startX = (canvas.width - buttonWidth) / 2;
    const startY = 150;

    let hovering = false;

    if (mouseX >= startX && mouseX <= startX + buttonWidth && mouseY >= startY && mouseY <= startY + buttonHeight) {
        hovering = true;
    }

    if (mouseX >= startX && mouseX <= startX + buttonWidth && mouseY >= startY + buttonHeight + buttonPadding && mouseY <= startY + buttonHeight + buttonPadding + buttonHeight) {
        hovering = true;
    }

    if (mouseX >= startX && mouseX <= startX + buttonWidth && mouseY >= startY + (buttonHeight + buttonPadding) * 2 && mouseY <= startY + (buttonHeight + buttonPadding) * 2 + buttonHeight) {
        hovering = true;
    }

    if (hovering) {
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.cursor = 'default';
    }
});


// Fonction pour dessiner le contenu du mode 'character'
function drawCharacterContent() {
    console.log("drawCharacterContent called");
    context.clearRect(0, 0, canvas.width, canvas.height);
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
            context.strokeStyle = '#C6FE20';
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
    }
}

window.addEventListener('load', loadSelectedCharacter);

let boss = null;
let bossHealth = 30;
let bossSpawned = false;
let bossShootInterval = 100;
let bossShootTimer = 0;

function adjustBossProperties(distance) {
    if (distance % bossSpawnDistance === 0 && distance !== 0 && !bossActive) {
        const bossHealth = 30 + (distance / bossSpawnDistance - 1) * 10;
        const bossShootInterval = Math.max(100 - Math.floor(distance / bossSpawnDistance) * 10, 20);
        spawnBoss(bossHealth, bossShootInterval);
    }
}

function spawnBoss(bossHealth, bossShootInterval) {
    let randomImageBoss = Math.floor(Math.random() * 3) + 1;
    const bossImage = new Image();
    bossImage.src = bossImages[randomImageBoss];
    bossImage.onload = () => {
        currentBoss = {
            x: canvas.width / 2 - 50,
            y: -100,
            width: 100,
            height: 100,
            health: bossHealth,
            speed: 1.3,
            image: bossImage,
            shootInterval: bossShootInterval,
            shootTimer: 0
        };
        bossActive = true;
    };
}

// Gérer les tirs du boss
function handleBossProjectiles() {
    bossProjectiles.forEach((proj, index) => {
        proj.y += proj.speed;
        if (projectileImageBoss.complete) {
            proj.width = 14;
            proj.height = 47;
            context.drawImage(projectileImageBoss, proj.x - 12, proj.y, proj.width, proj.height);
        } else {
            context.fillStyle = '#0000FF';
            context.fillRect(proj.x, proj.y, proj.width, proj.height);
        }
        if (proj.y > canvas.height) {
            bossProjectiles.splice(index, 1);
        }

        // Détecter les collisions avec le joueur
        if (
            proj.x < player.x + player.width &&
            proj.x + proj.width > player.x &&
            proj.y < player.y + player.height &&
            proj.height + proj.y > player.y
        ) {
            bossProjectiles.splice(index, 1);
            player.lives--;
            if (player.lives <= 0) {
                showGameOver();
            }
        }
    });
}

function displayDamage(text, x, y) {
    const damageText = {
        text: text,
        x: x,
        y: y,
        startTime: Date.now(),
        isActive: true
    };
    damageTexts.push(damageText);
}

function handleBossCollision() {
    if (!currentBoss) {
        return; 
    }

    const randomX = Math.floor(Math.random() * 11) + 20; // 20 & 30
    const randomY = Math.floor(Math.random() * 21) + 90; // 90 & 110

    projectiles.forEach((proj, pIndex) => {
        if (!currentBoss) {
            return;
        }
        if (
            proj.x < currentBoss.x + currentBoss.width &&
            proj.x + proj.width > currentBoss.x &&
            proj.y < currentBoss.y + currentBoss.height &&
            proj.height + proj.y > currentBoss.y
        ) {
            
            currentBoss.health -= projectileForce;
            projectiles.splice(pIndex, 2);
            displayDamage((projectileForce * 1000).toString(), currentBoss.x + randomX, currentBoss.y + randomY);
            if (currentBoss.health <= 0) {
                explosion = { 
                    x: currentBoss.x, 
                    y: currentBoss.y, 
                    width: currentBoss.width,  
                    height: currentBoss.height, 
                    startTime: Date.now() 
                }; 
                projectiles.splice(pIndex, 1);
                currentBoss = null; 
                bossActive = false;
                bossProjectiles.length = 0; 

                const multiplier = getScoreMultiplier(previousDistance);
                score += 10 * multiplier;

                paperBalls += 25 * multiplicateurPaperBalls;
                totalMonstersKilled++;
                totalPaperBalls += 25 * multiplicateurPaperBalls;
                updateStats();
            }
        }
    });
}

const distanceLogInterval = 100;
let lastLoggedDistance = 0;

function drawPlayContent() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    context.font = '20px Arial';

    const playerImage = images[selectedImageIndex];
    if (playerImage) {
        context.drawImage(playerImage, player.x, player.y, player.width, player.height);
    }

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

    const distance = Math.floor(gameDuration * enemySpeed);
    adjustBossProperties(distance);

    if (!bossActive) {
        adjustSpawnProbability();
        adjustEnemyHealth();
        spawnEnemy();
    }

    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.image) {
            context.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
        } else {
            context.fillStyle = '#00FF00';
            context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }

        projectiles.forEach((proj, pIndex) => {
            enemies.forEach((enemy, index) => {
                if (
                    proj.x < enemy.x + enemy.width &&
                    proj.x + proj.width > enemy.x &&
                    proj.y < enemy.y + enemy.height &&
                    proj.height + proj.y > enemy.y
                ) {
                    projectiles.splice(pIndex, 1);
                    enemy.health -= projectileForce;
                    displayDamage((projectileForce * 1000).toString(), enemy.x, enemy.y); 
        
                    if (enemy.health <= 0) {
                        explosion = { 
                            x: enemy.x, 
                            y: enemy.y, 
                            width: enemy.width,  
                            height: enemy.height, 
                            startTime: Date.now() 
                        };
                        projectiles.splice(pIndex, 1);
                        enemies.splice(index, 1);
        
                        const multiplier = getScoreMultiplier(previousDistance);
                        score += 1 * multiplier;
                        paperBalls += 1 * multiplicateurPaperBalls;
                        totalMonstersKilled++;
                        totalPaperBalls += 1 * multiplicateurPaperBalls;
                        updateStats();
                    }
                }
            });
        });

        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.height + player.y > enemy.y
        ) {
            enemies.splice(index, 1);
            player.lives -= 1;
            if (player.lives <= 0) {
                showGameOver();
            }
        }

        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            player.lives -= 1;
            if (player.lives <= 0) {
                showGameOver();
            }
        }
    });

    if (bossActive && currentBoss) {
        if (currentBoss.y < 150) {
            currentBoss.y += currentBoss.speed;
        } else {
            const distanceToPlayerX = Math.abs(player.x - currentBoss.x);
            if (distanceToPlayerX > 5) {
                if (player.x < currentBoss.x) {
                    currentBoss.x -= currentBoss.speed;
                } else if (player.x > currentBoss.x) {
                    currentBoss.x += currentBoss.speed;
                }
            }
        }

        context.drawImage(currentBoss.image, currentBoss.x, currentBoss.y, currentBoss.width, currentBoss.height);

        currentBoss.shootTimer++;
        if (currentBoss.shootTimer >= currentBoss.shootInterval) {
            currentBoss.shootTimer = 0;
            const projectile = {
                x: currentBoss.x + currentBoss.width / 2 - 12,
                y: currentBoss.y + currentBoss.height,
                width: 24,
                height: 24,
                speed: 5
            };
            bossProjectiles.push(projectile);
        }

        handleBossProjectiles();
        handleBossCollision();
    }

    explosionImageShow();

    context.fillStyle = '#000000';
    context.fillText(`Vies: ${player.lives}`, 10, 80);
    context.fillText(`Score: ${score.toFixed(0)}`, 10, 100);
    context.fillText(`Boulette: ${paperBalls}`, 10, 120);
    context.fillText(`Distance: ${distance}`, 10, 140);

    gameDuration += 1;
    if (gameDuration % speedIncrementInterval === 0) {
        enemySpeed += speedIncrement;
    }

    if (distance > previousDistance) {
        previousDistance = distance;
        document.getElementById('distance-max').textContent = previousDistance;
        saveStats();
    }
    
    drawDamageText(); 
}

function drawDamageText() {
    if (!damageTexts.length) return;

    const fadeDuration = 1000; 
    const currentTime = Date.now();
    
    for (let i = 0; i < damageTexts.length; i++) {
        const damageText = damageTexts[i];
        const elapsed = currentTime - damageText.startTime;

        if (elapsed < fadeDuration) {
            const fade = 1 - elapsed / fadeDuration;
            context.globalAlpha = fade;
            context.fillStyle = 'red';
            context.font = 'bold 22px Arial';
            const verticalMove = 10; 
            context.fillText(damageText.text, damageText.x, damageText.y - (elapsed / fadeDuration) * verticalMove); 
            context.globalAlpha = 1.0;
        } else {
            damageText.isActive = false; 
        }
    }
    
    for (let i = damageTexts.length - 1; i >= 0; i--) {
        if (!damageTexts[i].isActive) {
            damageTexts.splice(i, 1);
        }
    }
}


function addDamageText(text, x, y) {
    const damageText = {
        text: text,
        x: x,
        y: y,
        startTime: Date.now(),
        isActive: true
    };
    damageTexts.push(damageText);
}

function explosionImageShow() {
    if (explosion) {
        const currentTime = Date.now();
        const elapsed = currentTime - explosion.startTime;
        const fadeDuration = 700; 
        if (elapsed < fadeDuration) {
            context.globalAlpha = 1 - elapsed / fadeDuration; 
            context.drawImage(explosionImage, explosion.x, explosion.y, explosion.width, explosion.height); 
            context.globalAlpha = 1.0;
        } else {
            explosion = null; // Réinitialiser l'explosion après la durée de fondu
        }
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
        enemiesPerCycle = 1;
        spawnInterval = 90;
        enemiesPerCycle = 1;
    } else if (distance < 3000) {
        enemiesPerCycle = 1;
        spawnInterval = 70;
        enemiesPerCycle = 1;
        spawnInterval = 70;
        enemiesPerCycle = 1;
    } else if (distance < 4000) {
        enemiesPerCycle = 1;
        spawnInterval = 50;
        enemiesPerCycle = 1;
        spawnInterval = 50;
        enemiesPerCycle = 1;
        spawnInterval = 50;
        enemiesPerCycle = 1;
    } else if (distance < 5000) {
        enemiesPerCycle = 1;
        spawnInterval = 40;
        enemiesPerCycle = 1;
        spawnInterval = 40;
        enemiesPerCycle = 1;
        spawnInterval = 40;
        enemiesPerCycle = 1;
        spawnInterval = 40;
        enemiesPerCycle = 1;
    } else if (distance < 6000) {
        enemiesPerCycle = 1;
        spawnInterval = 30;
        enemiesPerCycle = 1;
        spawnInterval = 30;
        enemiesPerCycle = 1;
        spawnInterval = 30;
        enemiesPerCycle = 1;
        spawnInterval = 30;
        enemiesPerCycle = 1;
        spawnInterval = 30;
        enemiesPerCycle = 1;
    } else {
        enemiesPerCycle = 7;
        spawnInterval = 10;
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
            const x = Math.random() * (canvas.width - enemyWidth);
            const y = -enemyHeight;
            const imageIndex = (i + gameDuration / spawnInterval) % enemyImages.length;
            const image = enemyImages[imageIndex];
            enemies.push({ x, y, width: enemyWidth, height: enemyHeight, health: enemyHealth, image });
            console.log(enemySpeed);
        }
    }
}

function updateStats() {
    document.getElementById('distance-max').textContent = previousDistance;
    document.getElementById('meme-kill').textContent = totalMonstersKilled; 
    document.getElementById('boulette-papier').textContent = totalPaperBalls;
    saveStats();
}

function saveStats() {
    localStorage.setItem('totalMonstersKilled', totalMonstersKilled);
    localStorage.setItem('totalPaperBalls', totalPaperBalls);
    localStorage.setItem('distanceMax', previousDistance);
    localStorage.setItem('score', score);
}

function loadStats() {
    totalMonstersKilled = parseInt(localStorage.getItem('totalMonstersKilled'), 10) || 0;
    totalPaperBalls = parseInt(localStorage.getItem('totalPaperBalls'), 10) || 0;
    previousDistance = parseInt(localStorage.getItem('distanceMax'), 10) || 0;
    score = parseFloat(localStorage.getItem('score')) || 0; 
    updateStats();
}

function saveCosts() {
    localStorage.setItem('lifeCost', lifeCost);
    localStorage.setItem('strengthCost', strengthCost);
    localStorage.setItem('multiplierCost', multiplierCost);
    localStorage.setItem('projectileForce', projectileForce);
    localStorage.setItem('multiplicateurPaperBalls', multiplicateurPaperBalls);
    localStorage.setItem('achatDeLaVie', achatDeLaVie);
}

function loadCosts() {
    lifeCost = parseInt(localStorage.getItem('lifeCost'), 10) || 10;
    strengthCost = parseInt(localStorage.getItem('strengthCost'), 10) || 20;
    multiplierCost = parseInt(localStorage.getItem('multiplierCost'), 10) || 30;
    projectileForce = parseInt(localStorage.getItem('projectileForce'), 10) || 1;
    multiplicateurPaperBalls = parseInt(localStorage.getItem('multiplicateurPaperBalls'), 10) || 1;
    achatDeLaVie = parseInt(localStorage.getItem('achatDeLaVie'), 10) || 1;
}

window.addEventListener('load', loadStats);
window.addEventListener('load', () => {
    loadStats();
    loadCosts();
});
