// 맵 선택 JS
const AUTH_API = "http://localhost:8080/api";

let selectedLevel = 1;

const mapData = {
  1: {
    image: "img/map_easy.png",
    detail: "초보 모험가를 위한 평화로운 숲입니다",
  },
  2: {
    image: "img/map_normal.png",
    detail: "중급 지역입니다",
  },
  3: {
    image: "img/map_hard.png",
    detail: "숙련된 모험가만 들어갈 수 있는 지역입니다",
  },
};

// level 불러오기
function loadMap(level) {
  selectedLevel = level;

  // 버튼 active 변경
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
document.querySelector(".start-btn").addEventListener("click", () => {
  // 선택한 난이도 저장
  localStorage.setItem("selectedLevel", selectedLevel);

  // 게임 페이지 이동
  location.href = "game.html";
});

// 첫 화면은 쉬움으로 시작
window.onload = () => {
  loadMap(1);
};
