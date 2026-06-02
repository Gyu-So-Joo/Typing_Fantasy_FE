console.log("loginStatus 실행");

// 로그인 여부 확인
const memberId = localStorage.getItem("loginUser");

// 로그인 상태시 이미지 로고 변경 로그인->로그아웃
document.querySelector(".login-logo").src = memberId
  ? "img/logout.png"
  : "img/login.png";
