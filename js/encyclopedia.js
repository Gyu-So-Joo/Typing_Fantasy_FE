// 더미데이터 monsters를 받아옴
import monsters from "/js/monsters.js";

const pageSize = 6;
//페이지 네이션
let currentPage = 1;
renderPage(currentPage);
renderPagination();

//몬스터 카드 함수
function appendMonsterCards(monsters) {
    const grid = document.getElementById("wikiGrid");

    monsters.forEach((monster) => {
        const card = document.createElement("div");
        card.className = "monster-card";
        //카드 형태 정의
        card.innerHTML = `
      <div class="img-area">
        <img
          src="${monster.image}"
          alt="${monster.name}"
        >
      </div>
      <div class="monster-info">
        <div class="difficulty">
          ${monster.difficulty}
        </div>
        <h3>${monster.name}</h3>
      </div>

    `;
        //카드 클릭시 모달 오픈
        card.addEventListener("click", () => {
            openModal(monster);
        });

        grid.appendChild(card);
    });
}
//페이지 렌더링
function renderPage(page) {
    const grid = document.getElementById("wikiGrid");
    grid.innerHTML = "";
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const currentMonsters = monsters.slice(start, end);
    appendMonsterCards(currentMonsters);
}
//페이지 네이션 렌더링
function renderPagination() {
    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(monsters.length / pageSize);
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.addEventListener("click", () => {
            currentPage = i;
            renderPage(currentPage);
        });
        pagination.appendChild(btn);
    }
}
//모달 오픈 함수
function openModal(monster) {
    const modal = document.getElementById("wikiModal");
    //모달 내용 정의
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
                ${monster.difficulty}
            </p>
            <p>
                ${monster.description}
            </p>
        </div>
    `;
    //모달의 숨김 상태 제거
    modal.classList.remove("hidden");
    const closeBtn = modal.querySelector(".close-btn");
    //닫힘 버튼 클릭시 모달 닫힘 실행
    closeBtn.addEventListener("click", () => {
        closeModal();
    });
}
function closeModal() {
    const modal = document.getElementById("wikiModal");
    //모달에 숨김 상태 추가
    modal.classList.add("hidden");
}
