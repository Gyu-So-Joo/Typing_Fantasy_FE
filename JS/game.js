// 선택한 레벨
const level = localStorage.getItem("selectedLevel");

// 선택한 언어
const selectedLang = localStorage.getItem("selectedLang");

// 몬스터 조회 API
const API = "http://localhost:8080/api/monster/list";

// DOM 요소
const inputField = document.querySelector(".input__field");

// 현재 몬스터 정보
let currentMonster = null;
let monsterId = null; // ✅ 추가 (선택된 몬스터 ID)

// 코드 라인 목록
let codeLines = [];

// 현재 진행 중인 라인 번호
let currentLineIndex = 0;

// 입력 통계
let totalTyped = 0;
let correctTyped = 0;
let wrongTyped = 0;

// 게임 시작 시간
let gameStartTime = null;

// CPM 갱신 타이머
let cpmTimer = null;

// 경과 시간(초)
let timer = 0;

// 오류 통계
let errorStats = {
    special_char_error: 0,
    case_mismatch_error: 0,
    indentation_error: 0,
    normal_text_error: 0,
};

setBackgroundImage();
loadProblem();

// 엔터 입력 시 줄 채점
inputField.addEventListener("keydown", handleEnter);

// 입력 중 실시간 색상 변경
inputField.addEventListener("input", renderTypingLine);

// 화면 타이머
setInterval(updateTimer, 1000);

// 홈 버튼
document.getElementById("homeBtn").onclick = () => {
    location.href = "main.html";
};

// 스테이지 선택 버튼
document.getElementById("stageBtn").onclick = () => {
    location.href = "language.html";
};

// 몬스터 정보 조회 + 랜덤 선택
async function loadProblem() {
    try {
        const response = await fetch(API);
        const result = await response.json();

        const monsters = result.data;

        // ✔ level 기준 필터
        const filtered = monsters.filter((m) => m.level == level);

        if (!filtered || filtered.length === 0) {
            console.error("해당 레벨 몬스터 없음");
            return;
        }

        // ✔ 랜덤 선택
        const randomIndex = Math.floor(Math.random() * filtered.length);
        currentMonster = filtered[randomIndex];

        // ✔ ID 확정 및 저장
        monsterId = currentMonster.id;
        localStorage.setItem("selectedMonsterId", monsterId);

        renderCode(currentMonster);
        setMonsterImage();
    } catch (err) {
        console.error("몬스터 조회 실패:", err);
    }
}

// 몬스터 코드 세팅
function renderCode(monster) {
    let code = "";

    if (selectedLang === "java") {
        code = monster.javaCode;
    } else {
        code = monster.jsCode;
    }

    code = code.replaceAll("\\n", "\n");

    codeLines = code.split("\n");

    currentLineIndex = 0;

    renderCurrentLine();
}

// 현재 줄 출력
function renderCurrentLine() {
    if (currentLineIndex >= codeLines.length) return;

    inputField.value = "";

    renderTypingLine();
}

// 엔터 입력 처리
function handleEnter(e) {
    if (e.key !== "Enter") return;

    e.preventDefault();

    const userInput = inputField.value.trimStart();
    const targetLine = codeLines[currentLineIndex].trimStart();

    checkLine(userInput, targetLine);
    showAttackEffect();
    showMonsterHitEffect();
}

// 채점 로직
function checkLine(userInput, targetLine) {
    if (!gameStartTime) {
        gameStartTime = Date.now();
        cpmTimer = setInterval(updateCPM, 1000);
    }

    const maxLength = Math.max(userInput.length, targetLine.length);

    for (let i = 0; i < maxLength; i++) {
        const expected = targetLine[i] || "";
        const actual = userInput[i] || "";

        totalTyped++;

        if (expected === actual) {
            correctTyped++;
        } else {
            wrongTyped++;
            classifyError(expected, actual);
        }
    }

    updateAccuracy();

    currentLineIndex++;

    if (currentLineIndex >= codeLines.length) {
        finishGame();
        return;
    }

    renderCurrentLine();
}

// 게임 종료
function finishGame() {
    clearInterval(cpmTimer);

    const finalAccuracy =
        totalTyped === 0
            ? "0.0"
            : ((correctTyped / totalTyped) * 100).toFixed(1);

    const finalCpm = document.querySelector(".cpm").textContent;

    const elapsedSeconds = Math.floor((Date.now() - gameStartTime) / 1000);

    showResultModal(currentMonster, finalAccuracy, finalCpm, elapsedSeconds);
}

// 타이머
function updateTimer() {
    timer++;
    document.querySelector(".time").textContent = timer;
}

// 정확도
function updateAccuracy() {
    const accuracyElement = document.querySelector(".accuracy");

    if (totalTyped === 0) {
        accuracyElement.textContent = "0%";
        return;
    }

    const accuracy = (correctTyped / totalTyped) * 100;
    accuracyElement.textContent = accuracy.toFixed(1) + "%";
}

// CPM
function updateCPM() {
    const cpmElement = document.querySelector(".cpm");

    if (!gameStartTime) return;

    const elapsedMinutes = (Date.now() - gameStartTime) / 1000 / 60;

    if (elapsedMinutes <= 0) return;

    const cpm = Math.round(totalTyped / elapsedMinutes);

    cpmElement.textContent = cpm;
}

// 실시간 렌더
function renderTypingLine() {
    if (currentLineIndex >= codeLines.length) return;

    const typingText = document.querySelector(".typing__text");
    const targetLine = codeLines[currentLineIndex].trimStart();
    const inputValue = inputField.value;

    let html = "";

    for (let i = 0; i < targetLine.length; i++) {
        const targetChar = targetLine[i];

        if (i < inputValue.length) {
            if (inputValue[i] === targetChar) {
                html += `<span class="correct">${escapeHtml(targetChar)}</span>`;
            } else {
                html += `<span class="incorrect">${escapeHtml(targetChar)}</span>`;
            }
        } else {
            html += escapeHtml(targetChar);
        }
    }

    typingText.innerHTML = `<p>${html}</p>`;
}

// 결과 모달
function showResultModal(monster, accuracy, cpm, time) {
    document.getElementById("resultMonsterImg").src = monster.normalImg;
    document.getElementById("resultMonsterName").textContent = monster.name;
    document.getElementById("resultAccuracy").textContent = accuracy + "%";
    document.getElementById("resultCpm").textContent = cpm;
    document.getElementById("resultTime").textContent = time + "초";

    document.getElementById("resultModal").classList.remove("hidden");

    document.getElementById("resultSpecialError").textContent =
        errorStats.special_char_error;

    document.getElementById("resultCaseError").textContent =
        errorStats.case_mismatch_error;

    document.getElementById("resultNormalError").textContent =
        errorStats.normal_text_error;
}

// 오타 분류
function classifyError(expected, actual) {
    if (/[{}()[\];,.<>!?@#$%^&*+=\-_/\\|:'"`~]/.test(expected)) {
        errorStats.special_char_error++;
        return;
    }

    if (
        expected &&
        actual &&
        expected.toLowerCase() === actual.toLowerCase() &&
        expected !== actual
    ) {
        errorStats.case_mismatch_error++;
        return;
    }

    errorStats.normal_text_error++;
}

// HTML escape
function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

// 배경
function setBackgroundImage() {
    const backgroundImg = document.getElementById("backgroundImg");

    switch (level) {
        case "1":
            backgroundImg.src = "img/forestmap.png";
            break;

        case "2":
            backgroundImg.src = "img/mountinmap.png";
            break;

        case "3":
            backgroundImg.src = "img/lavamap.png";
            break;
    }
}

// 공격 이펙트
function showAttackEffect() {
    const attack = document.querySelector(".attack");

    attack.classList.add("active");

    setTimeout(() => {
        attack.classList.remove("active");
    }, 400);
}

// 몬스터 이미지
function setMonsterImage() {
    const monsterImage = document.getElementById("monsterImage");

    if (!currentMonster) return;

    monsterImage.src = currentMonster.normalImg;
}
//몬스터 피격
function showMonsterHitEffect() {
    const monster = document.getElementById("monsterImage");

    if (!monster) return;

    monster.classList.add("monster-shake");

    setTimeout(() => {
        monster.classList.remove("monster-shake");
    }, 400);
}
