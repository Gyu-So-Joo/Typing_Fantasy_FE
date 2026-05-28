const API = "http://localhost:8080/api/monster/list";

const pageSize = 6;
/* 현재 페이지 */
let currentPage = 1;
/* 전체 몬스터 저장 */
let allMonsters = [];
/* 최초 실행 */
loadMonsters();
// 몬스터 조회
function loadMonsters() {
    fetch(API)
        .then((res) => res.json())

        .then((data) => {
            console.log("몬스터 데이터:", data);

            allMonsters = data.data;

            renderPage(currentPage);

            renderPagination();
        })

        .catch((err) => {
            console.error("몬스터 불러오기 실패:", err);
        });
}
// 몬스터 카드 생성
function appendMonsterCards(monsters) {
    const grid = document.getElementById("wikiGrid");

    monsters.forEach((monster) => {
        console.log(monster);
        const card = document.createElement("div");

        card.className = "monster-card";
        card.innerHTML = `

            <div class="img-area">

                <img
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

        /* 카드 클릭 시 모달 오픈 */
        card.addEventListener("click", () => {
            openModal(monster);
        });

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
}
// 페이지네이션 렌더링
function renderPagination() {
    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    const totalPages = Math.ceil(allMonsters.length / pageSize);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");

        btn.textContent = i;

        /* 현재 페이지 active */
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
                src="${monster.image}"
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

    /* hidden 제거 */
    modal.classList.remove("hidden");

    const closeBtn = modal.querySelector(".close-btn");

    /* X 버튼 클릭 시 닫기 */
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
