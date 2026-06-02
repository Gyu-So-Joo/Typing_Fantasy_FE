// 로그인 상태시 이미지 로고 변경 로그인->로그아웃
import logoutImg from "../assets/logout.png";

if (localStorage.getItem("loginUser")) {
  document.querySelector(".login-logo").src = logoutImg;
}

console.log("loginStatus 실행");
