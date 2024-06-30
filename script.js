const levels = [
    [
        { hanja: "天", meaning: "하늘 천" },
        { hanja: "地", meaning: "땅 지" },
        { hanja: "玄", meaning: "검을 현" },
        { hanja: "黃", meaning: "누를 황" },
        { hanja: "宇", meaning: "집 우" },
        { hanja: "宙", meaning: "집 주" },
        { hanja: "洪", meaning: "넓을 홍" },
        { hanja: "荒", meaning: "거칠 황" },
        { hanja: "日", meaning: "날 일, 해 일" },
        { hanja: "月", meaning: "달 월" }
    ],
    [
        { hanja: "盈", meaning: "찰 영" },
        { hanja: "昃", meaning: "기울 측" },
        { hanja: "辰", meaning: "별 진(신)" },
        { hanja: "宿", meaning: "잘 숙, 별 수" },
        { hanja: "列", meaning: "벌릴 렬" },
        { hanja: "張", meaning: "베풀 장" },
        { hanja: "寒", meaning: "찰 한" },
        { hanja: "來", meaning: "올 래" },
        { hanja: "暑", meaning: "더울 서" },
        { hanja: "往", meaning: "갈 왕" }
    ],
    [
        { hanja: "秋", meaning: "가을 추" },
        { hanja: "收", meaning: "거둘 수" },
        { hanja: "冬", meaning: "겨울 동" },
        { hanja: "藏", meaning: "감출 장" },
        { hanja: "閏", meaning: "윤달 윤" },
        { hanja: "餘", meaning: "남을 여" },
        { hanja: "成", meaning: "이룰 성" },
        { hanja: "歲", meaning: "해 세" },
        { hanja: "律", meaning: "법칙 률, 곡조 률" },
        { hanja: "呂", meaning: "법칙 려, 곡조 려" }
    ],
    [
        { hanja: "調", meaning: "고를 조" },
        { hanja: "陽", meaning: "별 양" },
        { hanja: "雲", meaning: "구름 운" },
        { hanja: "騰", meaning: "오를 등" },
        { hanja: "致", meaning: "이룰 치" },
        { hanja: "雨", meaning: "비 우" },
        { hanja: "露", meaning: "이슬 로" },
        { hanja: "結", meaning: "맺을 결" },
        { hanja: "爲", meaning: "할 위, 될 위" },
        { hanja: "霜", meaning: "서리 상" }
    ],
    [
        { hanja: "金", meaning: "쇠 금" },
        { hanja: "生", meaning: "날 생" },
        { hanja: "麗", meaning: "고울 려" },
        { hanja: "水", meaning: "물 수" },
        { hanja: "玉", meaning: "구슬 옥" },
        { hanja: "出", meaning: "날 출" },
        { hanja: "崑", meaning: "뫼 곤" },
        { hanja: "岡", meaning: "뫼 강" },
        { hanja: "劍", meaning: "칼 검" },
        { hanja: "號", meaning: "이름 호" }
    ]
];

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

function createBoard(tabId, cardSet) {
    let cards = cardSet.concat(cardSet); // 10개의 카드를 2번씩 사용하여 20개 카드 생성
    shuffle(cards);
    const board = document.getElementById(tabId);
    board.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.hanja = card.hanja;
        cardElement.dataset.meaning = card.meaning;
        cardElement.addEventListener('click', flipCard);

        const frontElement = document.createElement('div');
        frontElement.classList.add('front');
        frontElement.innerHTML = `<div class="hanja">${card.hanja}</div><div class="meaning">${card.meaning}</div>`;

        const backElement = document.createElement('div');
        backElement.classList.add('back');
        backElement.innerHTML = ""; // 뒷면은 비어있게 설정

        cardElement.appendChild(frontElement);
        cardElement.appendChild(backElement);
        board.appendChild(cardElement);
    });

    // 모든 카드를 오픈 상태로 보여줌
    const allCards = board.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.add('flip');
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

    if (card1.dataset.hanja === card2.dataset.hanja) {
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
    const currentTab = document.querySelector('.game-container:not([style*="display: none"])');
    if (!currentTab) return;

    matchedCards = [];
    selectedCards = [];
    score = 0;
    scoreDisplay.textContent = score;

    const cardSet = levels[parseInt(currentTab.id.replace('tab', '')) - 1];

    // 모든 카드를 뒷면으로 숨김
    const allCards = currentTab.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.remove('flip');
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
                    currentTab.innerHTML = ''; // 게임 보드를 초기화
                    alert('Time is up!');
                }
            }, 1000);
            gameTimeout = setTimeout(() => {
                clearInterval(countdownInterval);
                currentTab.innerHTML = ''; // 게임 보드를 초기화
            }, gameTime * 1000);
        }
    }, 1000);
}

function openTab(tabId) {
    document.querySelectorAll('.game-container').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'grid';

    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.tab-button[onclick="openTab('${tabId}')"]`).classList.add('active');

    // 해당 탭의 카드 보드 생성 및 카드 오픈
    const cardSet = levels[parseInt(tabId.replace('tab', '')) - 1];
    createBoard(tabId, cardSet);
}

startButton.addEventListener('click', startGame);

// Initialize tabs with card sets
createBoard('tab1', levels[0]);
createBoard('tab2', levels[1]);
createBoard('tab3', levels[2]);
createBoard('tab4', levels[3]);
createBoard('tab5', levels[4]);

// Set the first tab as the default open tab
openTab('tab1');
