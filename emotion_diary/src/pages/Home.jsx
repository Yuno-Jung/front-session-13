import { useContext } from "react";
import Header from "../components/Header";
import Button from "../components/Button";
import DiaryList from "../components/DiaryList";
import { DiaryStateContext } from "../App";

const Home = ({ currentMonth, onIncreaseMonth, onDecreaseMonth }) => {
  const data = useContext(DiaryStateContext);

  return (
    <div>
      <Header
        title={`${currentMonth.split("-")[0]}년 ${Number(currentMonth.split("-")[1])}월`}
        leftChild={<Button onClick={onDecreaseMonth} text={"<"} />}
        rightChild={<Button onClick={onIncreaseMonth} text={">"} />}
      />
      {data.length === 0 ? (
        <p>데이터가 없습니다.</p>
      ) : (
        <DiaryList data={data} />
      )}
    </div>
  );
};

export default Home;
