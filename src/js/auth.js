// 로그인, 회원가입 JS
const AUTH_API = import.meta.env.VITE_API_URL;

// 회원가입
function register() {
  const id = document.getElementById("regId").value.trim();
  const pw = document.getElementById("regPw").value.trim();

  if (!id || !pw) {
    showMsg("registerMsg", "모든 항목을 입력해주세요", false);
    return;
  }

  // DB 연동
  fetch(`${AUTH_API}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: id,
      password: pw,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 201) {
        showMsg("registerMsg", "가입 완료! 로그인 페이지로 이동합니다.", true);

        setTimeout(() => {
          location.href = "login.html";
        }, 1500);
      } else {
        showMsg(
          "registerMsg",
          data.message || "가입 실패. 아이디를 확인해주세요.",
          false,
        );
      }
    })
    .catch(() => {
      showMsg("registerMsg", "서버 오류", false);
    });
}

// 메시지 출력
function showMsg(id, text, ok) {
  const el = document.getElementById(id);

  el.textContent = text;
  el.className = "msg " + (ok ? "ok" : "fail");
}

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  const id = document.getElementById("loginId").value.trim();
  const pw = document.getElementById("loginPw").value.trim();

  if (!id || !pw) {
    showMsg("loginMsg", "아이디와 비밀번호를 입력해주세요", false);
    return;
  }

  // DB 연동
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
        // 응답값 저장
        const userId = data.data.id;
        const loginUser = data.data.name;
        const selectedLang = data.data.selectedLang;

        // localStorage 저장
        localStorage.setItem("userId", userId);
        localStorage.setItem("loginUser", loginUser);
        localStorage.setItem("selectedLang", selectedLang);

        showMsg("loginMsg", "로그인 성공!", true);

        setTimeout(() => {
          location.href = "main.html";
        }, 1500);
      } else {
        showMsg("loginMsg", "아이디 또는 비밀번호가 틀렸습니다.", false);
      }
    })
    .catch(() => {
      showMsg("loginMsg", "서버 오류", false);
    });
});
