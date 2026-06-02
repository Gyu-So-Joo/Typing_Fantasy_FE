console.log("loginStatus 실행");
// 로그인 상태시 이미지 로고 변경 로그인->로그아웃
const memberId = localStorage.getItem("loginUser");

if (memberId) {
  document.querySelector(".login-logo").src = "../assets/logout.png";
}
