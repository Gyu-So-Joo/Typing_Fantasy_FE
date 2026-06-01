// 타이핑 효과
const content = "코드를 타이핑하여 몬스터를 잡아보세요!";
const text = document.querySelector(".text");
let i = 0;

function typing() {
    if (i < content.length) {
        let txt = content.charAt(i);
        text.innerHTML += txt;
        i++;
    }
}
setInterval(typing, 100);

// 게임 시작 버튼 클릭
function startGame() {
    location.href = "language.html";
}

//로그인 이벤트 리스너
loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const memberId = localStorage.getItem("loginUser");
    //로그인 x
    if (!memberId) {
        location.href = "login.html";
        return;
    }

    // 로그인 O
    localStorage.removeItem("loginUser");
    localStorage.removeItem("selectedLang");
    localStorage.removeItem("monsterIds");
    alert("로그아웃 되었습니다.");
    location.reload();
});

// 로그인 상태시 이미지 로고 변경 로그인->로그아웃
const memberId = localStorage.getItem("loginUser");

if (memberId) {
    document.querySelector(".login-logo").src = "img/logout.png";
}
