const loginId = localStorage.getItem("loginUser");
const API = `http://localhost:8080/api/user/${loginId}`;

checkLan();

function checkLan() {
  const lan = localStorage.getItem("selectedLang");
  if (lan != "JAVA" && lan != "JS") {
    document.querySelector(".chart").classList.add("blur-lock");
    document.querySelector(".chart-info").classList.add("blur-lock");
    document.querySelector(".lan").classList.add("blur-lock");
  }
}
// recordAccuracyAvg

// recordCpmAvg

// recordTotalErrors
// ->special_char_error': 1, 'case_mismatch_error': 0, 'indentation_error': 4, 'normal_text_error

// totalScore

document.getElementById("userId").textContent = `ID : ${loginId}`;
loadUserData();

//유저 데이터 조회(일단 user1로)
let userData = [];
function loadUserData() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      userData = data.data;
      const txt = userData.recordTotalErrors;
      const errorData = JSON.parse(txt);

      console.log(userData);
      console.log(JSON.parse(txt));
      createChart(errorData);
      renderAccuracyInfo(userData);
    })

    .catch((err) => {
      console.error("유저 불러오기 실패:", err);
    });
}

// 언어 선택
const langSelect = document.getElementById("langSelect");

langSelect.addEventListener("change", () => {
  localStorage.setItem("selectedLang", langSelect.value);
  checkLan();
});

// 차트 생성

function createChart(data) {
  const ctx = document.getElementById("errorChart");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["들여쓰기 오류", "일반 오타", "특수문자 오류", "대소문자 오류"],
      datasets: [
        {
          label: "오타 유형",
          data: [
            data.indentation_error,
            data.normal_text_error,
            data.special_char_error,
            data.case_mismatch_error,
          ],

          backgroundColor: ["#FFB6B9", "#FAE3D9", "#BBDED6", "#8AC6D1"],
          borderWidth: 2,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

//정확도 정보
function renderAccuracyInfo(data) {
  const txt = data.recordTotalErrors;
  const errorData = JSON.parse(txt);
  const accuracyText = document.getElementById("accuracyAvg");
  accuracyText.textContent = `평균 정확도 : ${data.recordAccuracyAvg * 100}%`;
  //평가 문구
  const assessment = document.getElementById("assessment");

  const accuracy = data.recordAccuracyAvg * 100;
  //평가 문구 조건
  if (accuracy >= 90) {
    assessment.textContent = "훌륭해요!! 완벽에 가까운 타이핑 실력이에요!";
  } else if (accuracy >= 70) {
    assessment.textContent = "오류를 조금만 더 줄여봐요!!";
  } else if (accuracy >= 50) {
    assessment.textContent = "노력이 필요하겠네요!!";
  } else {
    assessment.textContent = "형편없어요!!! 연습이 많이 필요해요!";
  }
  //많이 발생한 오류 코멘트
  const errorMap = {
    indentation_error: {
      count: errorData.indentation_error,
      label: "들여쓰기 오류",
      comment: "들여쓰기 규칙을 조금 더 익혀보세요!",
    },
    normal_text_error: {
      count: errorData.normal_text_error,
      label: "일반 오타",
      comment: "타자 정확도를 조금 더 신경써보세요!",
    },
    special_char_error: {
      count: errorData.special_char_error,
      label: "특수문자 오류",
      comment: "상황에 맞는 특수문자를 더 익혀봐요!",
    },
    case_mismatch_error: {
      count: errorData.case_mismatch_error,
      label: "대소문자 오류",
      comment: "Shift 사용에 익숙해져보세요!",
    },
  };

  // 가장 큰 오류 찾기
  let maxErrorKey = null;

  let maxCount = -1;

  for (const key in errorData) {
    if (errorData[key] > maxCount) {
      maxCount = errorData[key];

      maxErrorKey = key;
    }
  }

  const errorComment = document.getElementById("errorComment");

  const selectedError = errorMap[maxErrorKey];

  // 예외 처리
  if (!selectedError) {
    errorComment.textContent = "오류 데이터가 없습니다.";

    return;
  }

  errorComment.textContent = `
가장 많이 발생한 오류 :
${selectedError.label}

${selectedError.comment}
`;
}
