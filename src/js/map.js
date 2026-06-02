// 맵 선택 JS
const AUTH_API = "http://localhost:8080/api";

// 맵 레벨 저장
let selectedLevel = 1;

const mapData = {
  1: {
    image: "img/forestmap.png",
    detail: "초보 모험가를 모코모 평원입니다.",
  },
  2: {
    image: "img/mountinmap.png",
    detail: "중급 모험가를 위한 모코모 마운틴입니다.",
  },
  3: {
    image: "img/lavamap.png",
    detail: "숙련된 모험가만 들어갈 수 있는 모코모 화산지대입니다.",
  },
};

// level 불러오기
function loadMap(level) {
  // 난이도 저장
  selectedLevel = level;

  // 버튼 전부 선택 해제
  document.querySelectorAll(".level-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  document
    .querySelector(`.level-btn:nth-child(${level})`)
    .classList.add("active");

  // 맵 이미지 변경
  document.getElementById("mapImg").src = mapData[level].image;

  // 설명 변경
  document.getElementById("mapDetail").textContent = mapData[level].detail;
}

// 모험 시작 버튼
function startGame() {
  // 선택한 난이도 저장
  localStorage.setItem("selectedLevel", selectedLevel);

  // 게임 페이지 이동
  location.href = "game.html";
}

// 첫 화면은 쉬움으로 시작
window.onload = () => {
  loadMap(1);
};
