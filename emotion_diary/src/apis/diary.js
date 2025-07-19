import instance from "./api";

// 1) 월별 일기 조회 (GET /diaries?month=YYYY-MM)
export const getDiariesByMonth = async (month) => {
  try {
    const res = await instance.get(`/diaries`, {
      params: { month },  // month는 "YYYY-MM" 문자열 형식
    });
    return res.data;
  } catch (error) {
    console.error("[응답 에러] 월별 일기 조회 실패:", error);
    throw error;
  }
};

// 2) 단일 일기 조회 (GET /diaries/{id})
export const getDiaryById = async (id) => {
  try {
    const res = await instance.get(`/diaries/${id}`);
    return res.data;
  } catch (error) {
    console.error("[응답 에러] 단일 일기 조회 실패:", error);
    throw error;
  }
};

// 3) 일기 생성 (POST /diaries)
export const createDiary = async (createdDate, emotionId, content) => {
  try {
    const res = await instance.post(`/diaries`, {
      createdDate,
      emotionId,
      content,
    });
    return res.data;
  } catch (error) {
    console.error("[응답 에러] 일기 생성 실패:", error);
    throw error;
  }
};

// 4) 일기 수정 (PUT /diaries/{id})
export const updateDiary = async (id, createdDate, emotionId, content) => {
  try {
    const res = await instance.put(`/diaries/${id}`, {
      createdDate,
      emotionId,
      content,
    });
    return res.data;
  } catch (error) {
    console.error("[응답 에러] 일기 수정 실패:", error);
    throw error;
  }
};

// 5) 일기 삭제 (DELETE /diaries/{id})
export const deleteDiary = async (id) => {
  try {
    const res = await instance.delete(`/diaries/${id}`);
    return res.data;
  } catch (error) {
    console.error("[응답 에러] 일기 삭제 실패:", error);
    throw error;
  }
};
