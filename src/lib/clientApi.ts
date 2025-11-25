import axios from 'axios';
import qs from 'qs';

/**
 * Base URL for API endpoints
 */
// development
// const BASE_URL = 'http://127.0.0.1:3000/api/serviceApis';
// production
// const BASE_URL = 'https://phclubs.net:3000/api/serviceApis';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL+'/api/serviceApis';
/**
 * Axios instance with default configurations
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

/**
 * API client for interacting with the backend services
 */
const api = {
  /**
   * Student related API endpoints
   */
  student: {
    /**
     * Authenticate student with credentials
     * @param stuId - Student ID
     * @param password - Student password
     * @returns Promise with login response
     */
    login: async (stuId: string, password: string) => {
      const response = await axiosInstance.post('?action=login', qs.stringify({ stu_id: stuId, password: password }));
      return response.data;
    },

    /**
     * Logout student session
     * @param token - Authentication token
     * @returns Promise with logout response
     */
    logout: async (token: string) => {
      const response = await axiosInstance.post(`?action=logout&token=${token}`);
      return response.data;
    },

    /**
     * Update student password
     * @param token - Authentication token
     * @param password - New password
     * @returns Promise with password modification response
     */
    modifyPassword: async (token: string, password: string) => {
      const response = await axiosInstance.post(`?action=modifyPassword&token=${token}`, qs.stringify({ password }));
      return response.data;
    },

    /**
     * Get student profile information
     * @param token - Authentication token
     * @returns Promise with student profile data
     */
    getProfile: async (token: string) => {
      const response = await axiosInstance.get(`?action=getProfile&token=${token}`);
      return response.data;
    },

    /**
     * Retrieve time schedule list
     * @param token - Authentication token
     * @returns Promise with time list data
     */
    getTimeList: async (token: string) => {
      const response = await axiosInstance.get(`?action=getTimeList&token=${token}`);
      return response.data;
    },

    /**
     * Search functionality for students
     * @param token - Authentication token
     * @param searchType - Type of search
     * @param keyword - Search keyword
     * @returns Promise with search results
     */
    search: async (token: string, searchType: string, keyword: string) => {
      const response = await axiosInstance.post(`?action=search&token=${token}`, qs.stringify({ search_type: searchType, keyword }));
      return response.data;
    },

    /**
     * Get club time information for a student
     * @param token - Authentication token
     * @param stuId - Student ID
     * @returns Promise with club time data
     */
    getClubTime: async (token: string, stuId: string) => {
      const response = await axiosInstance.post(`?action=getClubTime&token=${token}`, qs.stringify({ stu_id: stuId }));
      return response.data;
    },

    /**
     * Retrieve personal data for student
     * @param token - Authentication token
     * @returns Promise with personal data
     */
    getPersonalData: async (token: string) => {
      const response = await axiosInstance.get(`?action=getPersonalData&token=${token}`);
      return response.data;
    },

    /**
     * Retrieve personal data for student
     * @param token - Authentication token
     * @returns Promise with personal data
     */
    getPersonalDataByYear: async (token: string, year: string) => {
      const response = await axiosInstance.post(`?action=getPersonalDataByYear&token=${token}`, qs.stringify({ year: year }));
      return response.data;
    },


    /**
     * Export student data
     * @param token - Authentication token
     * @returns Promise with exported data blob
     */
    exportData: async (token: string) => {
      const response = await axiosInstance.get(`?action=exportData&token=${token}`, { responseType: 'blob' });
      return response.data;
    }
  },

  /**
   * Club member management related API endpoints
   */
  clubMember: {
    /**
     * List all members of a club
     * @param token - Authentication token
     * @param clubId - Club identifier
     * @returns Promise with club members list
     */
    list: async (token: string, clubId: string) => {
      const response = await axiosInstance.post(`?action=clubMemberList&token=${token}`, qs.stringify({club_id: clubId }));
      return response.data;
    },

    /**
     * Search club members
     * @param token - Authentication token
     * @param clubId - Club identifier
     * @param searchType - Type of search
     * @param keyword - Search keyword
     * @returns Promise with search results
     */
    search: async (token: string, clubId: string, searchType: string, keyword: string) => {
      const response = await axiosInstance.post('?action=clubMemberSearch', qs.stringify({ token, club_id: clubId, search_type: searchType, keyword }));
      return response.data;
    },

    /**
     * Add new member to club
     * @param token - Authentication token
     * @param clubId - Club identifier
     * @param stuId - Student ID to add
     * @returns Promise with add member response
     */
    add: async (token: string, clubId: string, stuId: string) => {
      const response = await axiosInstance.post(`?action=clubMemberAdd&token=${token}`, qs.stringify({ club_id: clubId, stu_id: stuId }));
      return response.data;
    },

    /**
     * Delete members from club
     * @param token - Authentication token
     * @param clubId - Club identifier
     * @param clubMemberIds - Array of member IDs to delete
     * @returns Promise with delete response
     */
    delete: async (token: string, clubId: string, clubMemberIds: string) => {
      const response = await axiosInstance.post(`?action=clubMemberDelete&token=${token}`, qs.stringify({ club_id: clubId, club_member_ids: clubMemberIds }));
      return response.data;
    },

    /**
     * Member quits club
     * @param token - Authentication token
     * @param clubMemberId - Club member identifier
     * @returns Promise with quit response
     */
    quit: async (token: string, clubMemberId: string) => {
      const response = await axiosInstance.post(`?action=clubMemberQuit&token=${token}`, qs.stringify({ club_member_id: clubMemberId }));
      return response.data;
    },

    /**
     * Batch quit for multiple members
     * @param token - Authentication token
     * @param clubMemberIds - Array of member IDs to quit
     * @returns Promise with batch quit response
     */
    batchQuit: async (token: string, clubMemberIds: string[]) => {
      const response = await axiosInstance.post(`?action=clubMemberBatchQuit&token=${token}`, qs.stringify({ token, club_member_ids: clubMemberIds }));
      return response.data;
    },

    /**
     * Set time validity for club member
     * @param token - Authentication token
     * @param clubId - Club identifier
     * @param stuId - Student ID
     * @param isValid - Validity status
     * @returns Promise with time validity update response
     */
    setTimeValid: async (token: string, clubId: string, stuId: string, isValid: number) => {
      const response = await axiosInstance.post(`?action=clubMemberSetTimeValid&token=${token}`, qs.stringify({ club_id: clubId, stu_id: stuId, is_valid: isValid }));
      return response.data;
    }
  },

  /**
   * Session management related API endpoints
   */
  session: {
    /**
     * List all sessions for a club
     * @param token - Authentication token
     * @param clubId - Club identifier
     * @returns Promise with sessions list
     */
    list: async (token: string, clubId: string) => {
      const response = await axiosInstance.post(`?action=sessionList&token=${token}`, qs.stringify({club_id: clubId }));
      return response.data;
    },

    /**
     * Add new session
     * @param token - Authentication token
     * @param clubId - Club identifier
     * @param sessionName - Session name
     * @param sessionTime - Session time
     * @param sessionDate - Session date
     * @param createType - Creation type ('f' for fixed, 'd' for dynamic)
     * @returns Promise with add session response
     */
    add: async (token: string, clubId: string, sessionName: string, sessionTime: string, sessionDate: string, createType: 'f' | 'd') => {
      const response = await axiosInstance.post(`?action=sessionAdd&token=${token}`, qs.stringify({ 
        club_id: clubId, 
        session_name: sessionName, 
        session_time: sessionTime, 
        session_date: sessionDate, 
        create_type: createType
      }));
      return response.data;
    },

    /**
     * Get students in a session
     * @param token - Authentication token
     * @param clubId - Club identifier
     * @param sessionId - Session identifier
     * @returns Promise with session students data
     */
    getStudents: async (token: string, clubId: string, sessionId: number) => {
      const response = await axiosInstance.post(`?action=sessionGetStudents&token=${token}`, qs.stringify({ club_id: clubId, session_id: sessionId }));
      return response.data;
    },

    /**
     * Sign student attendance for session
     * @param token - Authentication token
     * @param clubStudentId - Club student identifier
     * @param sessionId - Session identifier
     * @param signStatus - Attendance status
     * @returns Promise with sign response
     */
    sign: async (token: string, clubStudentId: number, sessionId: number, signStatus: number) => {
      const response = await axiosInstance.post(`?action=sessionSign&token=${token}`, qs.stringify({ club_student_id: clubStudentId, session_id: sessionId, sign_status: signStatus }));
      return response.data;
    },

    /**
     * Delete sessions
     * @param token - Authentication token
     * @param clubId - Club identifier
     * @param sessionIds - Session IDs to delete
     * @returns Promise with delete response
     */
    delete: async (token: string, clubId: string, sessionIds: string) => {
      const response = await axiosInstance.post(`?action=sessionDelete&token=${token}`, qs.stringify({ club_id: clubId, session_ids: sessionIds }));
      return response.data;
    },

    /**
     * Search members in a session
     * @param token - Authentication token
     * @param searchType - Type of search
     * @param keyword - Search keyword
     * @param clubId - Club identifier
     * @param sessionId - Session identifier
     * @returns Promise with search results
     */
    searchMember: async (token: string, searchType: string, keyword: string, clubId: string, sessionId: string) => {
      const response = await axiosInstance.post(`?action=sessionSearchMember&token=${token}`, qs.stringify({ search_type: searchType, keyword, club_id: clubId, session_id: sessionId }));
      return response.data;
    },

    /**
     * Modify session name
     * @param token - Authentication token
     * @param sessionId - Session identifier
     * @param sessionName - New session name
     * @returns Promise with name modification response
     */
    modifyName: async (token: string, sessionId: string, sessionName: string) => {
      const response = await axiosInstance.post(`?action=sessionModifyName&token=${token}`, qs.stringify({ session_id: sessionId, session_name: sessionName }));
      return response.data;
    },

    /**
     * Set session time
     * @param token - Authentication token
     * @param clubStudentId - Club student identifier
     * @param sessionId - Session identifier
     * @param sessionTime - New session time
     * @returns Promise with time update response
     */
    setTime: async (token: string, clubStudentId: string, sessionId: string, sessionTime: number) => {
      const response = await axiosInstance.post(`?action=sessionSetTime&token=${token}`, qs.stringify({ club_student_id: clubStudentId, session_id: sessionId, session_time: sessionTime }));
      return response.data;
    }
  },

  /**
   * Club management related API endpoints
   */
  club: {
    /**
     * Get club rankings
     * @param token - Authentication token
     * @returns Promise with club rankings data
     */
    ranking: async (token: string) => {
      const response = await axiosInstance.post('?action=clubRanking', qs.stringify({ token }));
      return response.data;
    },

    /**
     * Get club statistics
     * @param token - Authentication token
     * @param clubId - Club identifier
     * @returns Promise with club statistics
     */
    statistic: async (token: string, clubId: string) => {
      const response = await axiosInstance.post('?action=clubStatistic', qs.stringify({ token, club_id: clubId }));
      return response.data;
    },

    /**
     * Search clubs
     * @param token - Authentication token
     * @param keywords - Search keywords
     * @returns Promise with search results
     */
    search: async (token: string, keywords: string) => {
      const response = await axiosInstance.post('?action=clubSearch', qs.stringify({ token, keywords }));
      return response.data;
    },

    /**
     * Get clubs where student is president
     * @param token - Authentication token
     * @param stuId - Student ID
     * @returns Promise with president clubs data
     */
    presidentClubs: async (token: string, stuId: string) => {
      const response = await axiosInstance.post(`?action=clubPresidentClubs&token=${token}`, qs.stringify({stu_id: stuId }));
      return response.data;
    },

    /**
     * Get detailed club information
     * @param token - Authentication token
     * @param clubId - Club identifier
     * @returns Promise with club details
     */
    getClubDetail: async (token: string, clubId: number) => {
      const response = await axiosInstance.post(`?action=clubGetClubDetail&token=${token}`, qs.stringify({club_id: clubId }));
      return response.data;
    },

    /**
     * Get club category index
     * @param token - Authentication token
     * @returns Promise with club categories
     */
    getClubCategoryIndex: async (token: string) => {
      const response = await axiosInstance.get(`?action=clubCategoryIndex&token=${token}`);
      return response.data;
    }
  }
};

export default api;
