checkLogin();

function checkLogin() {
  const memberId = localStorage.getItem("loginUser");
  //로그인 x
  if (!memberId) {
    location.href = "login.html";
    return;
  }
}
