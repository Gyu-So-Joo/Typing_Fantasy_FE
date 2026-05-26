import monsters from "/monsters.js";

const pageSize = 6;

let currentPage = 1;

renderPage(currentPage);
renderPagination();

function appendMonsterCards(monsters) {

  const grid =
    document.getElementById("wikiGrid");

  monsters.forEach((monster) => {

    const card =
      document.createElement("div");

    card.className = "monster-card";

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

    card.addEventListener("click", () => {
        openModal(monster);
    });

    grid.appendChild(card);

  });

}


function renderPage(page) {

  const grid = document.getElementById("wikiGrid");

  grid.innerHTML = "";

  const start = (page - 1) * pageSize;

  const end = start + pageSize;

  const currentMonsters =
    monsters.slice(start, end);

  appendMonsterCards(currentMonsters);

}

function renderPagination() {

  const pagination =
    document.getElementById("pagination");

  const totalPages =
    Math.ceil(monsters.length / pageSize);

  for (let i = 1; i <= totalPages; i++) {

    const btn =
      document.createElement("button");

    btn.textContent = i;

    btn.addEventListener("click", () => {

      currentPage = i;

      renderPage(currentPage);

    });

    pagination.appendChild(btn);

  }

}



function openModal(monster) {

    const modal =
        document.getElementById("wikiModal");

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

    modal.classList.remove("hidden");

    const closeBtn =
        modal.querySelector(".close-btn");

    closeBtn.addEventListener("click", () => {

        closeModal();

    });

}

function closeModal() {

    const modal =
        document.getElementById("wikiModal");
    modal.classList.add("hidden");
}