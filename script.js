const imageLinks = [
    'https://imgur.com/nlXVg3C.jpg',
    'https://imgur.com/haMA1Pt.jpg',
    'https://imgur.com/wYC1zZr.jpg',
    'https://imgur.com/iFzy7Kt.jpg',
    'https://imgur.com/P8p50xa.jpg',
    'https://imgur.com/dsNStvt.jpg',
    'https://imgur.com/kqlk8vx.jpg',
    'https://imgur.com/hbIhsLn.jpg'
];

const gameBoard = document.getElementById('game-board');
const startButton = document.getElementById('start-button');
const timeInput = document.getElementById('time-input');
const preGameTimerDisplay = document.getElementById('pre-game-timer');
const preGameTimeLeftDisplay = document.getElementById('pre-game-time-left');
const timeLeftDisplay = document.getElementById('time-left');
const scoreDisplay = document.getElementById('score-value');
let selectedCards = [];
let matchedCards = [];
let gameTimer;
let gameTimeout;
let countdownInterval;
let preGameInterval;
let score = 0;

function shuffle(array) {
    array.sort(() => 0.5 - Math.random());
}

function createBoard() {
    let cards = imageLinks.concat(imageLinks); // 8개의 이미지를 2번씩 사용하여 16개 카드 생성
    shuffle(cards);
    cards.forEach((imageSrc, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.image = imageSrc;

        const imgElement = document.createElement('img');
        imgElement.src = imageSrc;

        cardElement.appendChild(imgElement);
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard() {
    if (selectedCards.length < 2 && !this.classList.contains('flip')) {
        this.classList.add('flip');
        selectedCards.push(this);

        if (selectedCards.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }
}

function checkMatch() {
    const [card1, card2] = selectedCards;

    if (card1.dataset.image === card2.dataset.image) {
        matchedCards.push(card1, card2);
        selectedCards = [];
        score += 10;
        scoreDisplay.textContent = score;
        if (matchedCards.length === document.querySelectorAll('.card').length) {
            clearTimeout(gameTimeout);
            clearInterval(countdownInterval);
            alert('Congratulations! You found all matches.');
        }
    } else {
        card1.classList.remove('flip');
        card2.classList.remove('flip');
        selectedCards = [];
    }
}

function startGame() {
    gameBoard.innerHTML = ''; // 기존 카드들을 제거합니다.
    matchedCards = [];
    selectedCards = [];
    score = 0;
    scoreDisplay.textContent = score;
    createBoard();

    // 모든 카드를 5초간 오픈 상태로 보여줌
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.add('flip');
    });

    // 5초간의 프리게임 타이머 설정
    preGameTimerDisplay.style.display = 'block';
    let preGameTimeLeft = 5;
    preGameTimeLeftDisplay.textContent = preGameTimeLeft;

    preGameInterval = setInterval(() => {
        preGameTimeLeft -= 1;
        preGameTimeLeftDisplay.textContent = preGameTimeLeft;
        if (preGameTimeLeft <= 0) {
            clearInterval(preGameInterval);
            preGameTimerDisplay.style.display = 'none';

            allCards.forEach(card => {
                card.classList.remove('flip');
            });

            const gameTime = parseInt(timeInput.value, 10) * 60; // 입력된 시간을 초로 변환
            clearTimeout(gameTimeout);
            clearInterval(countdownInterval);
            let timeLeft = gameTime;
            timeLeftDisplay.textContent = timeLeft;
            countdownInterval = setInterval(() => {
                timeLeft -= 1;
                timeLeftDisplay.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                    gameBoard.innerHTML = ''; // 게임 보드를 초기화
                    alert('Time is up!');
                }
            }, 1000);
            gameTimeout = setTimeout(() => {
                clearInterval(countdownInterval);
                gameBoard.innerHTML = ''; // 게임 보드를 초기화
            }, gameTime * 1000);
        }
    }, 1000);
}

startButton.addEventListener('click', startGame);