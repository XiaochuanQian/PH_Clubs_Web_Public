import axios from 'axios';
import { InternalAxiosRequestConfig } from 'axios';


const BASE_URL = 'http://124.223.107.10:22222';
// const BASE_URL = 'http://101.34.211.174'; // Production environment URL

// Utility functions (you'll need to implement these)
// const getToken = async () => {
  
// };

// const setToken = (token: string): void => {
//   // Implement token setting logic
// };

const removeToken = (): void => {
  // Implement token removal logic
};

// const setUserInfo = (userInfo: any): void => {
//   // Implement user info setting logic
// };

const clearUserInfo = (): void => {
  // Implement user info clearing logic
};

const removeCredentials = (): void => {
  // Implement credentials removal logic
};

// Request interceptor
const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // const token = getToken();
  // const token = getLoginCookie();
  const token = 0;
  console.log(token)

  if (token) {
    if (config.method?.toUpperCase() === 'GET') {
      config.url = `${config.url}?token=${token}`;
    } else {
      config.data = {
        ...config.data,
        token: token
      };
    }
  }
  console.log(config)
  return config;
};

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

// Apply the interceptor
axiosInstance.interceptors.request.use(requestInterceptor);

// API client
const api = {
  student: {
    login: async (stuId: string, password: string) => {
      const response = await axiosInstance.post('/student/login', {
        stu_id: stuId,
        password: password
      });
      // console.log(response.data)
    //   if (response.data && response.data.api_token) {
    //     setToken(response.data.api_token);
    //     setUserInfo(response.data);
    //   } 
    // else if (response.data.code=='1001') {
    //     console.log("1")
    //     throw new Error('Student Id or password incorrect.');
    //   } else if (response.data.code=='4001') {
    //     console.log("2")
    //     throw new Error('Student Id or Password cannot be blank.');
    //   }
      return response.data;
    },
    logout: async () => {
      await axiosInstance.post('/student/logout');
      removeToken();
      removeCredentials();
      clearUserInfo();
    },
    modifyPassword: async (password: string) => {
      return axiosInstance.post('/student/modify-pass', { password });
    },
    getProfile: async () => {
      return axiosInstance.get('/student/student-profile');
    },
    getTimeList: async () => {
      return axiosInstance.get('/student/time-list');
    },
    search: async (searchType: string, keyword: string) => {
      return axiosInstance.post('/student/search', { search_type: searchType, keyword });
    },
    getClubTime: async (stuId: string) => {
      return axiosInstance.post('/student/club-time', { stu_id: stuId });
    },
    getPersonalData: async () => {
      return axiosInstance.get('/student/personal-data');
    },
    exportData: async () => {
      return axiosInstance.get('/student/export-student-data', { responseType: 'blob' });
    }
  },

  clubMember: {
    list: async (clubId: string) => {
      return axiosInstance.post('/club-member/list', { club_id: clubId });
    },
    search: async (clubId: string, searchType: string, keyword: string) => {
      return axiosInstance.post('/club-member/search', { club_id: clubId, search_type: searchType, keyword });
    },
    add: async (clubId: string, stuId: string) => {
      return axiosInstance.post('/club-member/add', { club_id: clubId, stu_id: stuId });
    },
    delete: async (clubId: string, clubMemberIds: string[]) => {
      return axiosInstance.post('/club-member/del', { club_id: clubId, club_member_ids: clubMemberIds });
    },
    quit: async (clubMemberId: string) => {
      return axiosInstance.post('/club-member/quit', { club_member_id: clubMemberId });
    },
    batchQuit: async (clubMemberIds: string[]) => {
      return axiosInstance.post('/club-member/batch-quit', { club_member_ids: clubMemberIds });
    },
    setTimeValid: async (clubId: string, stuId: string, isValid: boolean) => {
      return axiosInstance.post('/club-member/time-valid', { club_id: clubId, stu_id: stuId, is_valid: isValid });
    }
  },

  session: {
    list: async (clubId: string) => {
      return axiosInstance.post('/club/attendance', { club_id: clubId });
    },
    add: async (clubId: string, sessionName: string, sessionTimes: number, sessionDate: string, createType: string) => {
      return axiosInstance.post('/session/add', { club_id: clubId, session_name: sessionName, session_times: sessionTimes, session_date: sessionDate, create_type: createType });
    },
    getStudents: async (clubId: string, sessionId: string) => {
      return axiosInstance.post('/session/students', { club_id: clubId, session_id: sessionId });
    },
    sign: async (clubStudentId: string, sessionId: string, signStatus: string) => {
      return axiosInstance.post('/session/sign', { club_student_id: clubStudentId, session_id: sessionId, sign_status: signStatus });
    },
    delete: async (clubId: string, sessionIds: string[]) => {
      return axiosInstance.post('/session/del', { club_id: clubId, session_ids: sessionIds });
    },
    searchMember: async (searchType: string, keyword: string, clubId: string, sessionId: string) => {
      return axiosInstance.post('/session/search-member', { search_type: searchType, keyword, club_id: clubId, session_id: sessionId });
    },
    modifyName: async (sessionId: string, sessionName: string) => {
      return axiosInstance.post('/session/modify-name', { session_id: sessionId, session_name: sessionName });
    },
    setTime: async (clubStudentId: string, sessionId: string, sessionTime: number) => {
      return axiosInstance.post('/session/set-time', { club_student_id: clubStudentId, session_id: sessionId, session_time: sessionTime });
    }
  },

  club: {
    ranking: async () => {
      return axiosInstance.post('/club/ranking');
    },
    statistic: async (clubId: string) => {
      return axiosInstance.post('/club/statistic', { club_id: clubId });
    },
    search: async (keywords: string) => {
      return axiosInstance.post('/club/search', { keywords });
    },
    presidentClubs: async () => {
      return axiosInstance.post('/club/president-club');
    },
    getClubDetail: async (clubId: string) => {
      return axiosInstance.post('/club/detail', { club_id: clubId });
    },
  },

  clubCategory: {
    index: async () => {
      return axiosInstance.get('/club-category/index');
    },
  }
};

export default api;