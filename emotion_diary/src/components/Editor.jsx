import "./Editor.css";
import EmotionItem from "./EmotionItem";
import Button from "./Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { emotionList } from "../util/constants";
import { getStringedDate } from "../util/get-stringed-date";

const Editor = ({ initData, onSubmit }) => {
  const [input, setInput] = useState({
    createdDate: new Date(),
    emotionId: 3,
    content: "",
  });

  const nav = useNavigate();

  // initData가 변경이 될 때마다 callback 함수 안에서 if 문으로 initData가 실제 존재한다면 (제대로 일기 데이터를 불러왔다면)
 useEffect(() => {
      if (initData) {
          setInput({
              createdDate: new Date(initData.createdDate), // ✅ Date 객체로 변환
              emotionId: initData.emotionId,
              content: initData.content,
          });
      }
  }, [initData]);

  const onChangeInput = (e) => {
    // console.log(e.target.name)  어떤 요소에 입력이 들어온건지
    // console.log(e.target.value)  입력된 값이 무엇인지


    let name = e.target.name;
    let value = e.target.value;

    if (name === "createdDate") {
      value = new Date(value);
    }

    setInput({
      ...input,
      [name]: value,
    });
  };

  const onClickSubmitButton = () => {
    const finalInput = {
      ...input,
      createdDate:
        input.createdDate instanceof Date
          ? input.createdDate.getTime()
          : input.createdDate,  // 이미 숫자면 그대로 유지
    };

    onSubmit(finalInput);
};

  return (
    <div className="Editor">
      <section className="date_section">
        <h4>오늘의 날짜</h4>
        <input
          name="createdDate"
          onChange={onChangeInput}
          value={getStringedDate(input.createdDate)}
          type="date"
        />
      </section>
      <section className="emotion_section">
        <h4>오늘의 감정</h4>
        <div className="emotion_list_wrapper">
          {/* EmotionItem은 컴포넌트이기 때문에 event 객체가 자동으로 전달되지 않음 - 별도의 객체를 전달해야 함 */}
          {emotionList.map((item) => (
            <EmotionItem
              onClick={() =>
                onChangeInput({
                  target: {
                    name: "emotionId",
                    value: item.emotionId,
                  },
                })
              }
              key={item.emotionId}
              {...item}
              isSelected={item.emotionId === input.emotionId}
            />
          ))}
        </div>
      </section>
      <section className="content_section">
        <h4>오늘의 일기</h4>
        <textarea
          name="content"
          value={input.content}
          onChange={onChangeInput}
          placeholder="오늘은 어땠나요?"
        />
      </section>
      <section className="button_section">
        <Button onClick={() => nav(-1)} text={"취소하기"} />
        <Button
          onClick={onClickSubmitButton}
          text={"작성완료"}
          type={"POSITIVE"}
        />
      </section>
    </div>
  );
};

export default Editor;
