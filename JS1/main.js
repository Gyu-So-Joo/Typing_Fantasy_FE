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
    // localStorage 에 저장된 로그인 회원 번호 가져오기
    const memberId = localStorage.getItem("loginUser");

    // 로그인 안 된 상태
    if (!memberId) {
        alert("로그인이 필요합니다.");
        location.href = "login.html";
        return;
    }

    // 로그인 된 상태
    location.href = "language.html";
}
