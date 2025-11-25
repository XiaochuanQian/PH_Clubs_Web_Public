import axios from 'axios';
import qs from 'qs';

// 定义基础 URL
const BASE_URL = 'http://127.0.0.1:3000/api/betaAuth';

// 创建一个 axios 实例，设置默认配置
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

const betaAuthApi = {
    checkBetaStatus: async (stuId: string) => {
        const response = await axiosInstance.post(`?action=checkBetaStatus`, qs.stringify({ studentID: stuId }));
        console.log(response.data);
        return response.data;
    }
}

export default betaAuthApi;