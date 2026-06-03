// 회원가입 JS
const AUTH_API = import.meta.env.VITE_API_URL;

const registerBtn = document.getElementById("registerBtn");
const regPw = document.getElementById("regPw");

// 메시지 출력
function showMsg(id, text, ok) {
  const el = document.getElementById(id);

  el.textContent = text;
  el.className = "msg " + (ok ? "ok" : "fail");
}

// 회원가입
registerBtn.addEventListener("click", () => {
  const id = document.getElementById("regId").value.trim();
  const pw = document.getElementById("regPw").value.trim();

  if (!id || !pw) {
    showMsg("registerMsg", "모든 항목을 입력해주세요", false);
    return;
  }

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
        // showMsg("registerMsg", "가입 완료! 로그인 페이지로 이동합니다.", true);

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
});

// 패스워드에서 Enter 키 클릭 시, 회원가입 버튼 클릭
regPw.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  registerBtn.click();
});
