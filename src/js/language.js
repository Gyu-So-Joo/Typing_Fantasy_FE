// 언어 선택 JS

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

// 선택 언어 저장
const javaBtn = document.getElementById("javaBtn");
const jsBtn = document.getElementById("jsBtn");
javaBtn.addEventListener("click", () => {
    localStorage.setItem("selectedLang", "JAVA");
    // 맵 선택 페이지 이동
    location.href = "map.html";
});
jsBtn.addEventListener("click", () => {
    localStorage.setItem("selectedLang", "JS");
    // 맵 선택 페이지 이동
    location.href = "map.html";
});
