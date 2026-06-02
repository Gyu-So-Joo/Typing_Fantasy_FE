const API = import.meta.env.VITE_API_URL;

const userId = localStorage.getItem("userId");
const loginUser = localStorage.getItem("loginUser");
const selectedLang = localStorage.getItem("selectedLang");

const ctx = document.getElementById("errorChart");
const errorComment = document.getElementById("errorComment");
const chart = document.querySelector(".chart");
const chartInfo = document.querySelector(".chart-info");
const lan = document.querySelector(".lan");
const langSelect = document.getElementById("langSelect");

// 선택된 언어 유무에 따른 예외 처리
function checkLan() {
  if (!["JAVA", "JS"].includes(selectedLang)) {
    chart.classList.add("blur-lock");
    chartInfo.classList.add("blur-lock");
    lan.classList.add("blur-lock");
  }
}

// 유저 통게 데이터 로드
function loadUserData() {
  fetch(`${API}/user/${userId}/record/recent`)
    .then((res) => res.json())
    .then((data) => {
      const userData = data.data;
      createChart(userData);
      console.log(userData);
      renderAccuracyInfo(userData);
    })
    .catch((err) => {
      console.error("유저 불러오기 실패:", err);
    });
}

// 차트 생성
function createChart(data) {
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["일반 오타", "특수문자 오류", "대소문자 오류"],
      datasets: [
        {
          label: "오타 유형",
          data: [
            data.totalNormalTextError,
            data.totalSpecialCharError,
            data.totalCaseMismatchError,
          ],

          backgroundColor: ["#FFB6B9", "#FAE3D9", "#8AC6D1"],
          borderWidth: 3,
        },
      ],
    },

    options: {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
      },
    },
  });
}

// 정확도 정보 생성
function renderAccuracyInfo(data) {
  const accuracyText = document.getElementById("accuracyAvg");
  const assessment = document.getElementById("assessment");

  const accuracy = data.accuracyAvg * 100;

  accuracyText.textContent = `평균 정확도 : ${accuracy}%`;

  if (accuracy === 100) {
    assessment.textContent = "완벽해요!!! 단 하나의 오타도 없네요!";
  } else if (accuracy >= 95) {
    assessment.textContent = "훌륭해요!! 거의 완벽한 타이핑 실력이에요!";
  } else if (accuracy >= 90) {
    assessment.textContent = "아주 잘했어요! 정확도가 매우 높네요!";
  } else if (accuracy >= 80) {
    assessment.textContent = "좋아요! 조금만 더 집중하면 완벽해질 수 있어요!";
  } else if (accuracy >= 70) {
    assessment.textContent = "오류를 조금만 더 줄여봐요!!";
  } else if (accuracy >= 60) {
    assessment.textContent = "괜찮은 편이지만 정확도를 더 높여봐요!";
  } else if (accuracy >= 50) {
    assessment.textContent = "노력이 필요하겠네요!!";
  } else if (accuracy >= 30) {
    assessment.textContent =
      "오타가 많은 편이에요. 천천히 정확하게 입력해보세요!";
  } else {
    assessment.textContent =
      "연습이 많이 필요해요! 포기하지 말고 계속 도전해보세요!";
  }

  //많이 발생한 오류 코멘트
  const errors = [
    {
      name: "normalText",
      count: data.totalNormalTextError,
      label: "일반 오타",
      comment: "타자 정확도를 조금 더 신경써보세요!",
    },
    {
      name: "specialChar",
      count: data.totalSpecialCharError,
      label: "특수문자 오류",
      comment: "상황에 맞는 특수문자를 더 익혀봐요!",
    },
    {
      name: "caseMismatch",
      count: data.totalCaseMismatchError,
      label: "대소문자 오류",
      comment: "Shift 사용에 익숙해져보세요!",
    },
  ];

  // 가장 큰 오류 찾기
  let errorKey = 0;

  errors.forEach((value, index) => {
    if (errors[errorKey].count < value.count) errorKey = index;
  });

  const errorComment = document.getElementById("errorComment");

  const selectedError = errors[errorKey];

  errorComment.textContent = `가장 많이 발생한 오류 : ${selectedError.label}\n${selectedError.comment}`;
}

// 언어 선택
langSelect.addEventListener("change", () => {
  localStorage.setItem("selectedLang", langSelect.value);
  checkLan();
});

document.getElementById("userId").textContent = `ID : ${loginUser}`;
checkLan();
loadUserData();
