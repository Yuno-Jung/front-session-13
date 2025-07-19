import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import Editor from "../components/Editor";
import { useContext, useEffect, useState } from "react"
import { DiaryDispatchContext, DiaryStateContext } from "../App"
import DiaryItem from '../components/DiaryItem';
import useDiary from "../hooks/useDiary"
import { deleteDiary } from "../apis/diary";

const Edit = () => {
    // useParams : 리액트 라우터의 URL 파라미터를 불러오는 Hook
    // params라는 객체로 받아옴
    const params = useParams();
    const nav = useNavigate();
    const { onDelete, onUpdate } = useContext(DiaryDispatchContext);
    
    const curDiaryItem = useDiary(params.id);

    
    const onClickDelete = async () => {
        if (
            window.confirm("일기를 정말 삭제할까요? 다시 복구되지 않아요")
            ) {
            try {
                await deleteDiary(params.id); // 백엔드에 DELETE 요청
                onDelete(params.id);
                nav("/", { replace: true });  // 홈으로 이동
            } catch (error) {
                alert("삭제 중 오류가 발생했습니다.");
                console.error(error);
            }
        }
    }

    // const getCurrentDiaryItem = () => {
    //     const currentDiaryItem = data.find(
    //         (item) => String(item.id) === String(params.id)
    //     )

    //     if(!currentDiaryItem) {
    //         window.alert("존재하지 않는 일기입니다.")
    //         nav("/", {replace: true});
    //     }

    //     return currentDiaryItem;
    // }

    // 컴포넌트가 리렌더링 될 때마다 return 문 위에서 getCurrentDiaryItem()을 호출하고 그 결과값을 변수에 담아줌
    // currnetDiaryItem 변수에는 현재 일기 아이템의 data가 들어옴
    // const currentDiaryItem = getCurrentDiaryItem();
    // console.log(currentDiaryItem)

    const onSubmit = async (input) => {
  if (!input.content || input.content.trim().length === 0) {
      alert("내용을 입력해주세요.");
      return;
  }
  if (input.emotionId <= 0 || input.emotionId > 5) {
      alert("유효하지 않은 감정입니다.");
      return;
  }

  if (window.confirm("일기를 정말 수정할까요?")) {
      try {
          let createdDate;
          if (input.createdDate instanceof Date) {
            createdDate = input.createdDate;
          } else {
            createdDate = new Date(input.createdDate);
          }

          const updated = await onUpdate(
              params.id,
              createdDate.getTime(),
              input.emotionId,
              input.content
          );
          nav("/", { replace: true });
      } catch (error) {
          alert("수정 중 오류가 발생했습니다.");
          console.error(error);
      }
  }
};

    return  (
        <div>
            <Header title={"일기 수정하기"} leftChild={<Button onClick={() => nav(-1)} text={"< 뒤로 가기"} />} rightChild={<Button onClick={onClickDelete} text={"삭제하기"} type={"NEGATIVE"} />} />
            <Editor initData={curDiaryItem} onSubmit={onSubmit} />
        </div>
    )
}

export default Edit;