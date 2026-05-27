// 게임 시작 버튼 클릭
function startGame() {
  // localStorage 에 저장된 로그인 회원 번호 가져오기
  const memberId = localStorage.getItem("loginMemberId");

  // 로그인 안 된 상태
  if (!memberId) {
    alert("로그인이 필요합니다.");
    location.href = "login.html";
    return;
  }

  // 로그인 된 상태
  location.href = "game.html";
}
