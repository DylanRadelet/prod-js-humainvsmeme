function drawPlayContent() {
    let distance = gameDuration;
    let level = 1;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000000';
    context.font = '20px Arial';

    const playerImage = images[selectedImageIndex];
    if (playerImage) {
        context.drawImage(playerImage, player.x, player.y, player.width, player.height);
    }
    
    // console.log(`Projectiles: ${projectiles.length}, Enemies: ${enemies.length}, speed: ${enemySpeed}`);

    projectiles.forEach((proj, index) => {
        proj.width = 24;
        proj.height = 24;
        proj.y -= 5;
        if (proj.y < 0) {
            projectiles.splice(index, 1);
        }
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

    totalDistance += enemySpeed / 5;
    
    console.log(`gameDuration: ${Math.floor(gameDuration)}, enemySpeed: ${enemySpeed}, distance: ${Math.floor(distance)}`);
    
    adjustBossProperties(distance);

    level = Math.floor(distance/1000) ;
    if (distance < 1002) {
        enemySpeed = 0.5;
        enemyHealth = 1;
    }
    else if (distance < 2002) {
        enemySpeed = 0.8;
        enemyHealth = 3;
    }
    else if (distance < 3002) {
        enemySpeed = 1.2;
        enemyHealth = 5;
    }
    else if (distance < 4002) {
        enemySpeed = 1.7;
        enemyHealth = 7;
    }
    else if (distance < 5002) {
        enemySpeed = 2.3;
        enemyHealth = 9;
    }
    else if (distance < 6002) {
        enemySpeed = 3;
        enemyHealth = 11;
    }

    if (!bossActive) {
        adjustSpawnProbability();
        spawnEnemy();
    }
    if (bossActive === true) {
        distance = (1000 * level) + 1;
        gameDuration = (1000 * level) + 1;
    }
    else if(bossActive === false){
        distance = gameDuration;
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
            currentBoss.y += enemySpeed + 0.3;
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
                speed: 4
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
    context.fillText(`Distance: ${Math.floor(distance)}`, 20, 140);

    gameDuration += 0.1;


    if (distance > previousDistance) {
        previousDistance = distance;
        document.getElementById('distance-max').textContent = Math.floor(previousDistance);
        saveAll();
    }

    // if (distance < 1000) {
    //     enemyHealth = 1;
    // } else if (distance < 2000) {
    //     enemyHealth = 2;
    // } else if (distance < 3000) {
    //     enemyHealth = 3;
    // } else if (distance < 4000) {
    //     enemyHealth = 4;
    // } else if (distance < 5000) {
    //     enemyHealth = 5;
    // } else if (distance < 6000) {
    //     enemyHealth = 6;
    // } else {
    //     enemyHealth = 7;
    // }
    
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

