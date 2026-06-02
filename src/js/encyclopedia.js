const AUTH_API = import.meta.env.VITE_API_URL;
const API = `${AUTH_API}/user`;
const Mon_API = `${AUTH_API}/monster`;

function checkMon() {
  // 로컬 스토리지에서 몬스터 아이디 가져오기
  const mon = localStorage.getItem("monsterIds");
  const monsterIds = mon ? JSON.parse(mon) : [];
  // 모든 몬스터 카드 가져오기
  const cards = document.querySelectorAll(".monster-card");
  cards.forEach((card) => {
    const monsterId = Number(card.dataset.id);
    // 배열에 없는 몬스터
    if (!monsterIds.includes(monsterId)) {
      // 카드 내부 이미지 , 난이도 찾기
      const img = card.querySelector("img");
      const difficulty = card.querySelector(".difficulty");
      // 그림자 이미지로 변경
      img.src = "/src/assets/shadow.png";
      // const img = card.querySelector(".img");
      // img.style.backgroundImage = "url('/src/assets/shadow.png')";
      const title = card.querySelector("h3");
      title.textContent = "???";
    }
  });
}

const pageSize = 5;
// 현재 페이지
let currentPage = 1;
// 전체 몬스터 저장
let allMonsters = [];
//최초 실행
loadMonsters();
// 몬스터 조회
async function loadMonsters() {
  try {
    const userId = localStorage.getItem("userId");

    // 해금 목록
    const unlockedResponse = await fetch(`${API}/${userId}/monster-ids`);

    const unlockedResult = await unlockedResponse.json();

    localStorage.setItem("monsterIds", JSON.stringify(unlockedResult.data));

    // 전체 몬스터
    const monsterResponse = await fetch(`${Mon_API}/list`);

    const monsterResult = await monsterResponse.json();

    allMonsters = monsterResult.data;

    renderPage(currentPage);
    renderPagination();
  } catch (err) {
    console.error(err);
  }
}
// 몬스터 카드 생성
function appendMonsterCards(monsters) {
  const grid = document.getElementById("wikiGrid");

  monsters.forEach((monster) => {
    console.log(monster);
    const card = document.createElement("div");

    // 문자열 -> 배열
    const monsterIds = JSON.parse(localStorage.getItem("monsterIds"));
    const monsterId = Number(monster.id);

    console.log(monsterIds.includes(monsterId));
    const imageUrl = monsterIds.includes(monsterId)
      ? monster.normalImg
      : "/src/assets/shadow.png";

    card.className = "monster-card";
    card.innerHTML = `
            <div class="img-area">
                <img
                    class="img"
                    src="${monster.normalImg}"
                    alt="${monster.name}"
                >
            </div>
            <div class="monster-info">
                <div class="difficulty">
                    ${monster.level}
                </div>
                <h3>${monster.name}</h3>
            </div>
        `;
    card.dataset.id = monster.id;

    //해금 몬스터
    if (monsterIds.includes(monsterId)) {
      card.addEventListener("click", () => {
        openModal(monster);
      });
    } else {
      //미해금 몬스터
      // 카드 내부 이미지
      const img = card.querySelector("img");
      // 그림자 이미지
      img.src = "/src/assets/shadow.png";

      // 이름 변경
      const title = card.querySelector("h3");

      title.textContent = "???";

      // 난이도 숨김
      const difficulty = card.querySelector(".difficulty");

      difficulty.textContent = "?";
    }

    grid.appendChild(card);
  });
}

// 페이지 렌더링
function renderPage(page) {
  const grid = document.getElementById("wikiGrid");

  grid.innerHTML = "";

  const start = (page - 1) * pageSize;

  const end = start + pageSize;

  const currentMonsters = allMonsters.slice(start, end);

  appendMonsterCards(currentMonsters);
  checkMon();
}
// 페이지네이션 렌더링
function renderPagination() {
  const pagination = document.getElementById("pagination");

  pagination.innerHTML = "";

  const totalPages = Math.ceil(allMonsters.length / pageSize);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");

    btn.textContent = i;

    // 현재 페이지 active
    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      currentPage = i;

      renderPage(currentPage);

      renderPagination();
    });

    pagination.appendChild(btn);
  }
}
// 모달 오픈
function openModal(monster) {
  const modal = document.getElementById("wikiModal");

  modal.innerHTML = `

        <div class="modal-box">

            <button class="close-btn">
                X
            </button>

            <img
                src="${monster.normalImg}"
                alt="${monster.name}"
                class="modal-img"
            >

            <h2>${monster.name}</h2>

            <p>
                난이도 :
                ${monster.level}
            </p>

            <p>
                ${monster.detail}
            </p>

        </div>

    `;

  // hidden 제거
  modal.classList.remove("hidden");

  const closeBtn = modal.querySelector(".close-btn");

  //버튼 클릭 시 닫기
  closeBtn.addEventListener("click", () => {
    closeModal();
  });
}

// 모달 닫기

function closeModal() {
  const modal = document.getElementById("wikiModal");

  modal.classList.add("hidden");
}
// 모달 바깥 클릭 시 닫기

const modal = document.getElementById("wikiModal");

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});
