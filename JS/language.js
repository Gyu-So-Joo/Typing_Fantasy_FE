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
