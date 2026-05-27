const API = "http://localhost:8080/api/user";

let allRank = [];
let filteredRank = [];

window.onload = function () {
  loadTotalScore();
};

function loadTotalScore() {
  //   fetch(API)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       allRank = data.sort((a, b) => b.totalScore - a.totalScore);
  //       filteredRank = allRank;
  //       resetInfiniteScroll();
  //     })
  //     .catch((err) => console.error("랭킹 불러오기 실패:", err));
  //
  const data = [
    { name: "이규태", totalScore: 152340 },
    { name: "소윤서", totalScore: 141220 },
    { name: "김우주", totalScore: 129830 },
    { name: "유레카", totalScore: 120000 },
    { name: "슬라임", totalScore: 114500 },
    { name: "나이트", totalScore: 108220 },
    { name: "메이지", totalScore: 103400 },
    { name: "아처", totalScore: 98700 },
    { name: "드래곤", totalScore: 95400 },
    { name: "고블린", totalScore: 91220 },
    { name: "루나", totalScore: 88770 },
    { name: "레온", totalScore: 84210 },
    { name: "세이지", totalScore: 80100 },
    { name: "팬텀", totalScore: 76300 },
    { name: "에코", totalScore: 72880 },

    { name: "헌터", totalScore: 70100 },
    { name: "아인", totalScore: 68820 },
    { name: "제로", totalScore: 67450 },
    { name: "엘프", totalScore: 66110 },
    { name: "마린", totalScore: 64990 },
    { name: "오크", totalScore: 63340 },
    { name: "시온", totalScore: 62010 },
    { name: "케인", totalScore: 61100 },
    { name: "리안", totalScore: 59880 },
    { name: "벨라", totalScore: 58210 },

    { name: "카인", totalScore: 57100 },
    { name: "리아", totalScore: 56320 },
    { name: "태오", totalScore: 55140 },
    { name: "로이", totalScore: 54010 },
    { name: "하린", totalScore: 52990 },
    { name: "시엘", totalScore: 51800 },
    { name: "루크", totalScore: 50610 },
    { name: "니아", totalScore: 49990 },
    { name: "도윤", totalScore: 48770 },
    { name: "아라", totalScore: 47620 },

    { name: "카즈", totalScore: 46550 },
    { name: "레나", totalScore: 45220 },
    { name: "미르", totalScore: 44110 },
    { name: "시우", totalScore: 43200 },
    { name: "유진", totalScore: 42150 },
    { name: "하울", totalScore: 41020 },
    { name: "라온", totalScore: 39880 },
    { name: "진우", totalScore: 38710 },
    { name: "린", totalScore: 37500 },
    { name: "제이드", totalScore: 36120 },

    { name: "카엘", totalScore: 35010 },
    { name: "유나", totalScore: 33990 },
    { name: "노아", totalScore: 32880 },
    { name: "하율", totalScore: 31770 },
    { name: "서준", totalScore: 30550 },
    { name: "리아나", totalScore: 29440 },
    { name: "루비", totalScore: 28320 },
    { name: "태린", totalScore: 27100 },
    { name: "시후", totalScore: 25990 },
    { name: "에반", totalScore: 24880 },

    { name: "미나", totalScore: 23770 },
    { name: "아델", totalScore: 22650 },
    { name: "유성", totalScore: 21440 },
    { name: "카론", totalScore: 20330 },
    { name: "벨", totalScore: 19120 },
    { name: "리아드", totalScore: 18000 },
    { name: "라엘", totalScore: 16990 },
    { name: "세아", totalScore: 15880 },
    { name: "도현", totalScore: 14770 },
    { name: "아이작", totalScore: 13650 },
  ];

  allRank = data.sort((a, b) => b.totalScore - a.totalScore);
  filteredRank = allRank;
  resetInfiniteScroll();
}

const PAGE_SIZE = 8;
let currentPage = 0;
let isLoading = false;

const sentinel = document.getElementById("rankSentinel");

const rankList = document.getElementById("rankList");

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && !isLoading) {
      loadMoreRank();
    }
  },
  {
    root: rankList,
    threshold: 0.1,
  },
);

observer.observe(sentinel);

function resetInfiniteScroll() {
  rankList.innerHTML = "";
  rankList.appendChild(sentinel);

  currentPage = 0;
  sentinel.textContent = "로딩 중...";
  loadMoreRank();
}

function loadMoreRank() {
  if (isLoading) return;
  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const batch = filteredRank.slice(start, end);

  if (batch.length === 0) {
    sentinel.textContent =
      filteredRank.length === 0
        ? "랭킹이 없습니다"
        : "모든 랭킹을 불러왔습니다.";
    return;
  }

  isLoading = true;
  appendRank(batch, start);
  currentPage++;
  isLoading = false;

  if (end >= filteredRank.length) {
    sentinel.textContent = "모든 랭킹을 불러왔습니다.";
    return;
  }
}

function appendRank(ranks, start) {
  const rankList = document.getElementById("rankList");

  ranks.forEach((user, index) => {
    const div = document.createElement("div");

    div.className = "rank-item";

    div.innerHTML = `
    <span>${start + index + 1}</span>
    <span>${user.name}</span>
    <span>${user.totalScore.toLocaleString()}</span>
    `;

    rankList.appendChild(div);
  });
}
