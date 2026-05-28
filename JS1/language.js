// 언어 선택 JS
const AUTH_API = "http://localhost:8080/api";

// 사용 언어 선택 타이핑 효과
const content = "사용 언어를 선택하세요";
const text = document.querySelector(".select-text");
let i = 0;

function typing() {
  if (i < content.length) {
    let txt = content.charAt(i);
    text.innerHTML += txt;
    i++;
  }
}
setInterval(typing, 100);

// 언어 선택
function selectLanguage(language) {
  // 선택 언어 저장
  localStorage.setItem("selectedLang", language);

  console.log("선택 언어:", language);

  // 맵 선택 페이지 이동
  location.href = "map.html";
}
