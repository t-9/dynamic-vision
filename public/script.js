const cardContainer = document.getElementById('card-container');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart');
const hitSound = document.getElementById('hit-sound');
const bgm = document.getElementById('bgm');

let score = 0;
let timeLeft = 30;
let cards = [];
let targetCard;
let moveInterval;
let gameInterval;
let moveSpeed = 500; // 初期移動間隔（ミリ秒）

function createCards() {
  cardContainer.innerHTML = '';
  cards = [];
  for (let i = 0; i < 6; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.addEventListener('click', () => handleCardClick(card));
    cardContainer.appendChild(card);
    cards.push(card);
  }
  setTargetCard();
}

function setTargetCard() {
  if (targetCard) targetCard.classList.remove('target');
  const randomIndex = Math.floor(Math.random() * cards.length);
  targetCard = cards[randomIndex];
  targetCard.classList.add('target');
}

function handleCardClick(card) {
  if (card === targetCard) {
    score += 10;
    scoreDisplay.textContent = `スコア: ${score}`;
    card.classList.add('clicked');
    hitSound.play();
    setTimeout(() => {
      card.classList.remove('clicked');
      setTargetCard();
    }, 300);
    adjustDifficulty();
  }
}

function moveCards() {
  cards.forEach(card => {
    const maxX = cardContainer.clientWidth - card.clientWidth;
    const maxY = cardContainer.clientHeight - card.clientHeight;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
  });
}

function adjustDifficulty() {
  if (score % 50 === 0 && moveSpeed > 200) {
    moveSpeed -= 50; // スコア50ごとに移動速度を上げる
    clearInterval(moveInterval);
    moveInterval = setInterval(moveCards, moveSpeed);
  }
}

function startGame() {
  score = 0;
  timeLeft = 30;
  moveSpeed = 500;
  scoreDisplay.textContent = `スコア: ${score}`;
  timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
  gameOverScreen.classList.add('hidden');
  createCards();
  bgm.pause();
  bgm.currentTime = 0;
  bgm.play().catch(error => {
    console.error('BGM再生エラー:', error);
  });
  clearInterval(moveInterval);
  clearInterval(gameInterval);
  moveInterval = setInterval(moveCards, moveSpeed);
  gameInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
  cards.forEach(card => card.classList.remove('disabled')); // クリックを有効化
}

function endGame() {
  clearInterval(moveInterval);
  clearInterval(gameInterval);
  bgm.pause();
  finalScoreDisplay.textContent = score;
  gameOverScreen.classList.remove('hidden');
  cards.forEach(card => card.classList.add('disabled')); // クリックを無効化
}

restartButton.addEventListener('click', startGame);

document.getElementById('start-button').addEventListener('click', () => {
  startGame();
  document.getElementById('start-button').style.display = 'none'; // ボタンを非表示にする
});