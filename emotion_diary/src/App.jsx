import "./App.css";
import { useReducer, useRef, createContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Edit from "./pages/Edit";
import Notfound from "./pages/Notfound";
import { getDiariesByMonth } from "./apis/diary";
import { createDiary, updateDiary, deleteDiary } from "./apis/diary";

function reducer(state, action) {
  let nextState;

  switch (action.type) {
    case "INIT":
      return action.data;

    case "CREATE":
      nextState = [action.data, ...state];
      break;

    case "UPDATE":
      nextState = state.map((item) =>
        String(item.id) === String(action.data.id) ? action.data : item
      );
      break;

    case "DELETE":
      console.log("리듀서 DELETE 실행, 삭제 id:", action.id);
      nextState = state.filter((item) => String(item.id) !== String(action.id));
      break;

    default:
      return state;
  }

  if (nextState) {
    localStorage.setItem("diary", JSON.stringify(nextState));
    return nextState;
  }
  return state;
}

export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0);

  // currentMonth는 "YYYY-MM" 문자열 상태로 관리
  const [currentMonth, setCurrentMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  );

  // 월별 일기 데이터 가져오기 (currentMonth가 바뀔 때마다 서버에서 재요청)
  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const list = await getDiariesByMonth(currentMonth);
        dispatch({ type: "INIT", data: list });
        setIsLoading(false);
      } catch (error) {
        console.error("월별 데이터 불러오기 실패", error);
        setIsLoading(false);
      }
    };
    fetchMonthlyData();
  }, [currentMonth]);

  // 새로운 일기 추가
  const onCreate = async (createdDate, emotionId, content) => {
    try {
      const newItem = await createDiary(createdDate, emotionId, content);
      console.log("✅ 일기 등록 성공:", newItem);
      dispatch({
        type: "CREATE",
        data: newItem,
      });
    } catch (error) {
      console.error("❌ 등록 실패:", error);
    }
  };

  // 기존 일기 수정
  const onUpdate = async (id, createdDate, emotionId, content) => {
    try {
      const updated = await updateDiary(id, createdDate, emotionId, content);
      console.log("✅ 수정 완료 (App.jsx - onUpdate):", updated);

      dispatch({
        type: "UPDATE",
        data: updated,
      });

      return updated;
    } catch (err) {
      alert("일기 수정 중 오류가 발생했습니다.");
      throw err;
    }
  };

  // 기존 일기 삭제
  const onDelete = async (id) => {
    try {
      await deleteDiary(id); // 서버에 삭제 요청
      // 삭제 후에도 currentMonth 유지하며 최신 월별 데이터 다시 요청
      const updatedList = await getDiariesByMonth(currentMonth);
      dispatch({ type: "INIT", data: updatedList });
    } catch (error) {
      alert("삭제 중 오류 발생");
      console.error(error);
    }
  };

  // 월 변경 함수
  const onIncreaseMonth = () => {
    const [year, month] = currentMonth.split("-");
    let newYear = Number(year);
    let newMonth = Number(month) + 1;
    if (newMonth > 12) {
      newYear++;
      newMonth = 1;
    }
    setCurrentMonth(`${newYear}-${String(newMonth).padStart(2, "0")}`);
  };

  const onDecreaseMonth = () => {
    const [year, month] = currentMonth.split("-");
    let newYear = Number(year);
    let newMonth = Number(month) - 1;
    if (newMonth < 1) {
      newYear--;
      newMonth = 12;
    }
    setCurrentMonth(`${newYear}-${String(newMonth).padStart(2, "0")}`);
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                currentMonth={currentMonth}
                onIncreaseMonth={onIncreaseMonth}
                onDecreaseMonth={onDecreaseMonth}
              />
            }
          />
          <Route path="/new" element={<New />} />
          <Route path="/diary/:id" element={<Diary />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
