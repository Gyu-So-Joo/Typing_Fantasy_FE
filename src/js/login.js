// 로그인 JS
const AUTH_API = import.meta.env.VITE_API_URL;

// 메시지 출력
function showMsg(id, text, ok) {
  const el = document.getElementById(id);

  el.textContent = text;
  el.className = "msg " + (ok ? "ok" : "fail");
}

// 로그인
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  const id = document.getElementById("loginId").value.trim();
  const pw = document.getElementById("loginPw").value.trim();

  if (!id || !pw) {
    showMsg("loginMsg", "아이디와 비밀번호를 입력해주세요", false);
    return;
  }

  fetch(`${AUTH_API}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: id,
      password: pw,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 200) {
        const userId = data.data.id;
        const loginUser = data.data.name;
        const selectedLang = data.data.selectedLang;

        localStorage.setItem("userId", userId);
        localStorage.setItem("loginUser", loginUser);
        localStorage.setItem("selectedLang", selectedLang);

        // showMsg("loginMsg", "로그인 성공!", true);

        setTimeout(() => {
          location.href = "main.html";
        }, 1500);
      } else {
        showMsg("loginMsg", "아이디 또는 비밀번호가 틀렸습니다.", false);
      }
    })
    .catch(() => {
      // showMsg("loginMsg", "서버 오류", false);
    });
});
