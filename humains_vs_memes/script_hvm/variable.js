const imgGameOver = new Image();
const projectileImageBoss = new Image();
const projectileImage = new Image();
const explosionImage = new Image();

projectileImageBoss.src = './assets_hvm/images/projectile/chartreuse-verte.png'; 
projectileImage.src = './assets_hvm/images/projectile/projectile.png'; 
explosionImage.src = './assets_hvm/images/explosion.png'; 
imgGameOver.src = './assets_hvm/images/Game_Over.png'; 

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

const damageTexts = [];
const images = [];
const enemyImages = [];
const imageRects = [];
const bosses = [];
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const menu = document.getElementById('menu');
const playButton = document.getElementById('playButton');
const characterButton = document.getElementById('characterButton');
const inventoryButton = document.getElementById('inventoryButton');
const confirmModal = document.getElementById('confirmModal');
const confirmYes = document.getElementById('confirmYes');
const confirmNo = document.getElementById('confirmNo');
const distanceButton = document.getElementById('distanceButton');
const distanceModal = document.getElementById('distanceModal');
const distanceOptions = document.getElementById('distanceOptions');
const confirmDistance = document.getElementById('confirmDistance');
const closeDistanceModal = document.getElementById('closeDistanceModal');
const speedIncrementInterval = 1000;
const speedIncrement = 0.5;
const spawnIncrementInterval = 1000;
const spawnIncrement = 0.001;
const ColorBackBTN = "#C2C2C2";
const ColorTXT = "#000000";
const distanceLogInterval = 100;
const shootingIntervalTime = 220;

let selectedDistance = 0;
let enemySpeed = 0.5;
let spawnProbability = 0.01;
let gameDuration = 0;
let score = 0;
let paperBalls = 0;
let multiplicateurPaperBalls = 1;
let achatDeLaVie = 0;
let totalPaperBalls = 0;
let totalMonstersKilled = 0;
let bossSpawnDistance = 1000; 
let selectedImageIndex = 0;  
let imagesLoaded = 0;  
let lifeCost = 25;
let strengthCost = 100;
let multiplierCost = 50;
let projectileForce = 0;
let countdown = 3; 
let gameLoopId;
let previousDistance = 0;
let totalDistance = 0;
let currentMode = 'menu'; 
let currentBoss = null;
let bossActive = false;
let gameStarted = false;
let explosion = null;
let boss = null;
let bossHealth = 30;
let bossSpawned = false;
let bossShootInterval = 100;
let bossShootTimer = 0;
let lastLoggedDistance = 0;
let shootingInterval;
let enemyHealth = 1;

let damageText = {
    text: '1000',
    x: 0,
    y: 0,
    startTime: 0,
    isActive: false
};

let player = { x: canvas.width / 2 - 50, y: canvas.height - 200, width: 100, height: 100, lives: 5 };
let backButton = { x: 20, y: 25, size: 20 };

let bossProjectiles = [];
let projectiles = [];
let enemies = [];

let distance = gameDuration * 0.5 / 3;


