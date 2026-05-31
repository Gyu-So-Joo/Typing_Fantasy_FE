// 선택한 몬스터 ID
const monsterId = localStorage.getItem("selectedLevel");

// 선택한 언어
const selectedLang = localStorage.getItem("selectedLang");

// 몬스터 조회
const API = `http://localhost:8080/api/monster/${monsterId}`;

// DOM 요소

const inputField = document.querySelector(".input__field");

// 현재 몬스터 정보
let currentMonster = null;

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

// 몬스터 정보 조회
async function loadProblem() {
    try {
        const response = await fetch(API);

        const result = await response.json();

        currentMonster = result.data;

        renderCode(currentMonster);
    } catch (err) {
        console.error("몬스터 조회 실패:", err);
    }
}

// 몬스터의 코드 데이터를 화면에 세팅
function renderCode(monster) {
    let code = "";

    if (selectedLang === "java") {
        code = monster.javaCode;
    } else {
        code = monster.jsCode;
    }

    // DB의 \n 문자열을 실제 줄바꿈으로 변환
    code = code.replaceAll("\\n", "\n");

    // 줄 단위 분리
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
}

// 현재 줄 채점
function checkLine(userInput, targetLine) {
    // 첫 입력 시 게임 시작
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

    // 모든 줄 완료
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

// 경과 시간 표시
function updateTimer() {
    timer++;

    document.querySelector(".time").textContent = timer;
}

// 정확도 계산
function updateAccuracy() {
    const accuracyElement = document.querySelector(".accuracy");

    if (totalTyped === 0) {
        accuracyElement.textContent = "0%";
        return;
    }

    const accuracy = (correctTyped / totalTyped) * 100;

    accuracyElement.textContent = accuracy.toFixed(1) + "%";
}

// CPM 계산
function updateCPM() {
    const cpmElement = document.querySelector(".cpm");

    if (!gameStartTime) return;

    const elapsedMinutes = (Date.now() - gameStartTime) / 1000 / 60;

    if (elapsedMinutes <= 0) return;

    const cpm = Math.round(totalTyped / elapsedMinutes);

    cpmElement.textContent = cpm;
}

// 현재 줄을 실시간으로 색상 표시
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

// 게임 결과 모달 출력
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

// 오타 유형 분류
function classifyError(expected, actual) {
    // 특수문자 오타
    if (/[{}()[\];,.<>!?@#$%^&*+=\-_/\\|:'"`~]/.test(expected)) {
        errorStats.special_char_error++;
        return;
    }

    // 대소문자 오타
    if (
        expected &&
        actual &&
        expected.toLowerCase() === actual.toLowerCase() &&
        expected !== actual
    ) {
        errorStats.case_mismatch_error++;
        return;
    }

    // 일반 오타
    errorStats.normal_text_error++;
}

// HTML 태그 이스케이프 처리
function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}
