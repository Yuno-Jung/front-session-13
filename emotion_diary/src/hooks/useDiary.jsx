import { useState, useEffect } from "react";
import { getDiaryById } from "../apis/diary";
import { useNavigate } from "react-router-dom";

const useDiary = (id) => {
  const [curDiaryItem, setCurDiaryItem] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const data = await getDiaryById(id);
        setCurDiaryItem(data);
      } catch (error) {
        alert("존재하지 않는 일기입니다.");
        nav("/", { replace: true });
      }
    };
    if (id) fetchDiary();
  }, [id, nav]);

  return curDiaryItem;
};

export default useDiary;
