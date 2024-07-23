function drawPlayContent() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    context.font = '20px Arial';

    const playerImage = images[selectedImageIndex];
    if (playerImage) {
        context.drawImage(playerImage, player.x, player.y, player.width, player.height);
    }
    
    console.log(`Projectiles: ${projectiles.length}, Enemies: ${enemies.length}`);

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

    // Mettez à jour la distance totale parcourue
    totalDistance += enemySpeed / 5;
    const distance = Math.floor(totalDistance);
    
    //console.log(`gameDuration: ${gameDuration}, enemySpeed: ${enemySpeed}, distance: ${distance}`);

    
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
    context.fillText(`Vies: ${player.lives}`, 20, 80);
    context.fillText(`Score: ${score.toFixed(0)}`, 20, 100);
    context.fillText(`Boulette: ${paperBalls}`, 20, 120);
    context.fillText(`Distance: ${distance}`, 20, 140);

    gameDuration += 0.1;
    if (distance === 1000) {
        enemySpeed += speedIncrement;
    }
    else if (distance === 2000) {
        enemySpeed += speedIncrement;
    }
    else if (distance === 3000) {
        enemySpeed += speedIncrement;
    }
    else if (distance === 4000) {
        enemySpeed += speedIncrement;
    }
    else if (distance === 5000) {
        enemySpeed += speedIncrement;
    }
    else if (distance === 6000) {
        enemySpeed += speedIncrement;
    }
    else if (distance === 7000) {
        enemySpeed += speedIncrement;
    }

    if (distance > previousDistance) {
        previousDistance = distance;
        document.getElementById('distance-max').textContent = previousDistance;
        saveAll();
    }
    
    drawDamageText(); 
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
            explosion = null; 
        }
    }
}

