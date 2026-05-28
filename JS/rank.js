// 백엔드 API 주소
const API = "http://localhost:8080/api/user";

const loginUser = localStorage.getItem("loginUser");

let allRank = []; // 전체 랭킹
let filteredRank = [];

// 페이지 로드 시 실행
window.onload = function () {
  loadTotalScore();
};

// 총 점수 랭킹 불러오기
function loadTotalScore() {
  fetch(`${API}/stats/${loginUser}`)
    .then((res) => res.json()) // JSON 형태로 변환
    .then((data) => {
      allRank = [
        {
          name: loginUser,
          totalScore: data.data.totalScore,
        },
      ];

      filteredRank = allRank;

      // 무한스크롤 초기화
      resetInfiniteScroll();
    })
    .catch((err) => console.error("랭킹 불러오기 실패:", err));
}

const PAGE_SIZE = 8; // 한 번에 보여줄 랭킹 개수
let currentPage = 0; // 현재 몇 번째 페이지인지 저장
let isLoading = false; // 중복 실행 방지

const sentinel = document.getElementById("rankSentinel");

// 랭킹 목록 영역
const rankList = document.getElementById("rankList");

const observer = new IntersectionObserver(
  (entries) => {
    // sentinel 이 보이고 + 현재 로딩 중이 아닐 때만 실행
    if (entries[0].isIntersecting && !isLoading) {
      loadMoreRank();
    }
  },
  {
    // rankList 영역 안에서 감지
    root: rankList,

    // 10% 보이면 실행
    threshold: 0.1,
  },
);

observer.observe(sentinel); // sentinel 감지 시작

// 무한스크롤 초기화
function resetInfiniteScroll() {
  rankList.innerHTML = ""; // 기존 랭킹 목록 제거
  rankList.appendChild(sentinel); // 다시 추가
  currentPage = 0;
  sentinel.textContent = "로딩 중...";
  loadMoreRank();
}

// 랭킹 추가 로드
function loadMoreRank() {
  if (isLoading) return; // 중복 실행 방지
  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const batch = filteredRank.slice(start, end); // 이번에 보여줄 항목들

  if (batch.length === 0) {
    // 데이터 자체가 없을 경우
    sentinel.textContent =
      filteredRank.length === 0
        ? "랭킹이 없습니다"
        : // 끝까지 다 불러왔을 경우
          "모든 랭킹을 불러왔습니다.";
    return;
  }

  isLoading = true;
  appendRank(batch, start); // 화면에 랭킹 추가
  currentPage++;
  isLoading = false;

  // 마지막 데이터까지 다 불러왔으면
  if (end >= filteredRank.length) {
    // 완료 문구 표시
    sentinel.textContent = "모든 랭킹을 불러왔습니다.";
    return;
  }
}

// 랭킹 화면에 추가
function appendRank(ranks, start) {
  // 랭킹 리스트 영역 가져오기
  const rankList = document.getElementById("rankList");

  // 전달받은 랭킹 배열 반복
  ranks.forEach((user, index) => {
    const div = document.createElement("div");
    div.className = "rank-item";

    // 랭킹 HTML
    div.innerHTML = `
    <span>${start + index + 1}</span>
    <span>${user.name}</span>
    <span>${user.totalScore.toLocaleString()}</span>
    `;

    // 화면에 추가
    rankList.appendChild(div);
  });
}
