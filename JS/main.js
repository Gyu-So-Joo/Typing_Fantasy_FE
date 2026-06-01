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
    // 선택된 언어 조회
    const selectedLang = localStorage.getItem("selectedLang");

    // 선택 언어가 있으면 바로 맵 페이지
    if (selectedLang) {
        location.href = "map.html";
    }
    // 없으면 언어 선택 페이지
    else {
        location.href = "language.html";
    }
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
    localStorage.removeItem("userId");
    localStorage.removeItem("loginUser");
    localStorage.removeItem("selectedLang");
    localStorage.removeItem("selectedLevel");
    alert("로그아웃 되었습니다.");
    location.reload();
});
