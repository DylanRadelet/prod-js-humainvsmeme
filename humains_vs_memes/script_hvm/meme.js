// Charger les images des ennemis
enemyImageSrcs.forEach((src, index) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        enemyImages[index] = img;
    };
    img.onerror = () => {
        console.error(`Error loading enemy image at ${src}`);
    };
});

function adjustBossProperties(gameDuration) {
    if (Math.floor(gameDuration) % bossSpawnDistance === 0 && Math.floor(gameDuration) !== 0 && !bossActive) {
        const bossHealth = 30 + (gameDuration / bossSpawnDistance - 1) * 10;
        const bossShootInterval = Math.max(100 - Math.floor(gameDuration / bossSpawnDistance) * 10, 20);
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
        enemies.length = 0;
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

function adjustSpawnProbability() {
    if (distance < 1000) {
        enemiesPerCycle = 1;
        spawnInterval = 100;
    } else if (distance < 2000) {
        enemiesPerCycle = 1;
        spawnInterval = 90;
    } else if (distance < 3000) {
        enemiesPerCycle = 1;
        spawnInterval = 70;
    } else if (distance < 4000) {
        enemiesPerCycle = 1;
        spawnInterval = 50;
    } else if (distance < 5000) {
        enemiesPerCycle = 1;
        spawnInterval = 40;
    } else if (distance < 6000) {
        enemiesPerCycle = 1;
        spawnInterval = 30;
    } else {
        enemiesPerCycle = 7;
        spawnInterval = 100;
    }
}

let lastSpawnedDuration = -10; 

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnEnemy() {
    const flooredGameDuration = Math.floor(gameDuration);
    let imgMemeRand = getRandomInt(1, 11);
    
    if (flooredGameDuration % 10 === 0 && flooredGameDuration !== lastSpawnedDuration) {
        const enemyWidth = 50;
        const enemyHeight = 50;
        const x = Math.random() * (canvas.width - enemyWidth);
        const y = -enemyHeight;
        const imageIndex = imgMemeRand;
        const image = enemyImages[imageIndex];
        enemies.push({ x, y, width: enemyWidth, height: enemyHeight, health: enemyHealth, image });
        lastSpawnedDuration = flooredGameDuration; 
    }
}
