// 로그인, 회원가입 JS
const AUTH_API = "http://localhost:8080/api";

// 회원가입
function register() {
  const nickname = document.getElementById("regNickname").value.trim();
  const id = document.getElementById("regId").value.trim();
  const pw = document.getElementById("regPw").value.trim();

  if (!nickname || !id || !pw) {
    showMsg("registerMsg", "모든 항목을 입력해주세요", false);
    return;
  }

  //   DB VO랑 이름 맞추기
  fetch(`${AUTH_API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nickname: nickname,
      username: id,
      password: pw,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.result === "ok") {
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
    .catch(() => showMsg("registerMsg", "서버 오류", false));
}

// 로그인
function login() {
  const id = document.getElementById("loginId").value.trim();
  const pw = document.getElementById("loginPw").value.trim();

  if (!id || !pw) {
    showMsg("loginMsg", "아이디와 비밀번호를 입력해주세요", false);
    return;
  }

  //   DB VO랑 이름 맞추기
  fetch(`${AUTH_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: id,
      password: pw,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.result === "ok") {
        localStorage.setItem("loginUser", data.nickname);
        localStorage.setItem("loginRole", data.role);
        localStorage.setItem("loginMemberId", data.memberId);

        showMsg("loginMsg", `${data.nickname}님 환영합니다!`, true);

        setTimeout(() => {
          location.href = "index.html";
        }, 1500);
      } else {
        showMsg("loginMsg", "아이디 또는 비밀번호가 틀렸습니다.", false);
      }
    })
    .catch(() => showMsg("loginMsg", "서버 오류", false));
}

// 메시지 출력
function showMsg(id, text, ok) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = "msg " + (ok ? "ok" : "fail");
}
