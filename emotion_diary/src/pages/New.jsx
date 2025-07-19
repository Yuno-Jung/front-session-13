import Header from "../components/Header"
import Button from "../components/Button"
import Editor from "../components/Editor"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { DiaryDispatchContext } from "../App"

const New = () => {
    const { onCreate } = useContext(DiaryDispatchContext)
    const nav = useNavigate();

   const onSubmit = async (input) => {
    try {
        await onCreate(input.createdDate.getTime(), input.emotionId, input.content);
        nav('/', { replace: true });
    } catch (error) {
        alert("일기 등록 중 문제가 발생했습니다.");
    }
    };

    return (
        <div>
            <Header 
            title={"새 일기 쓰기"}
            leftChild={<Button onClick={() => nav(-1)} text={"< 뒤로 가기"} />}
             />
             <Editor onSubmit={onSubmit} />
        </div>
    )
}

export default New;