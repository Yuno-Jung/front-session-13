import axios from "axios";

// 개발 환경이면 프록시 주소, 배포 환경이면 실제 주소
const BASE_URL = import.meta.env.DEV
  ? "/api"
  : "https://api.opaue.shop";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// 응답 인터셉터 추가
instance.interceptors.response.use(
  (res) => {
    console.log("[응답 성공]", res);
    return res;
  },
  (err) => {
    console.error("[응답 에러]", err);
    return Promise.reject(err);
  }
);

export default instance;