import logoutImg from "../assets/logout.png";

const loginBtn = document.getElementById("loginBtn");

// 로그인 상태시 이미지 로고 변경 로그인->로그아웃
if (localStorage.getItem("loginUser")) {
  document.querySelector(".login-logo").src = logoutImg;
}

// 로그인, 로그아웃 이벤트 리스너
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
