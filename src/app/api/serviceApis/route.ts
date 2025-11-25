import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import querystring from 'querystring';

// Base URL for the backend API service
const BASE_URL = process.env.BACKEND_URL; // TODO: Add the BASE_URL to environmental variable

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

/**
 * Handle GET requests for various student and club related operations
 * @param request - The incoming Next.js request object
 * @returns NextResponse with the requested data or error message
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const token = searchParams.get('token'); // Get token from query parameters

  // Validate token presence
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 401 });
  }

  try {
    let response;
    // Route different actions to corresponding API endpoints
    switch (action) {
      case 'getProfile':
        // Fetch student profile information
        response = await axiosInstance.get(`/student/student-profile?token=${token}`);
        break;
      case 'getTimeList':
        // Fetch student time records
        response = await axiosInstance.get(`/student/time-list?token=${token}`);
        break;
      case 'getPersonalData':
        // Fetch student personal data
        response = await axiosInstance.get(`/student/personal-data?token=${token}`);
        break;
      case 'exportData':
        // Export student data as blob
        response = await axiosInstance.get(`/student/export-student-data?token=${token}`, { responseType: 'blob' });
        break;
      case 'clubCategoryIndex':
        // Fetch club categories
        response = await axiosInstance.get(`/club-category/index?token=${token}`);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: 'Request failed', msg: error }, { status: 500 });
  }
}

/**
 * Handle POST requests for various student and club related operations
 * @param request - The incoming Next.js request object
 * @returns NextResponse with the operation result or error message
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const token = searchParams.get('token'); // Get token from URL parameters

    // Token validation (except for login)
    if (!token && action !== 'login') {
      return NextResponse.json({ error: 'Token is required' }, { status: 401 });
    }

    // Parse request body
    const bodyText = await request.text();
    const body = querystring.parse(bodyText);

    // Validate action presence
    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    try {
      let response;
      // Route different actions to corresponding API endpoints
      switch (action) {
        // Authentication related endpoints
        case 'login':
          response = await axiosInstance.post('/student/login', bodyText);
          break;
        case 'logout':
          response = await axiosInstance.post(`/student/logout?token=${token}`);
          break;
        case 'modifyPassword':
          response = await axiosInstance.post(`/student/modify-pass?token=${token}`, bodyText);
          break;

        // Student related endpoints
        case 'search':
          response = await axiosInstance.post(`/student/search?token=${token}`, bodyText);
          break;
        case 'getClubTime':
          response = await axiosInstance.post(`/student/club-time?token=${token}`, bodyText);
          break;
        case 'getPersonalDataByYear':
          // Fetch student personal data
          response = await axiosInstance.post(`/student/personal-data?token=${token}`, bodyText);
          break;

        // Club member management endpoints
        case 'clubMemberList':
          response = await axiosInstance.post(`/club-member/list?token=${token}`, bodyText);
          break;
        case 'clubMemberSearch':
          response = await axiosInstance.post(`/club-member/search?token=${token}`, bodyText);
          break;
        case 'clubMemberAdd':
          response = await axiosInstance.post(`/club-member/add?token=${token}`, bodyText);
          break;
        case 'clubMemberDelete':
          response = await axiosInstance.post(`/club-member/del?token=${token}`, bodyText);
          break;
        case 'clubMemberQuit':
          response = await axiosInstance.post(`/club-member/quit?token=${token}`, bodyText);
          break;
        case 'clubMemberBatchQuit':
          response = await axiosInstance.post(`/club-member/batch-quit?token=${token}`, bodyText);
          break;
        case 'clubMemberSetTimeValid':
          response = await axiosInstance.post(`/club-member/time-valid?token=${token}`, bodyText);
          break;

        // Session management endpoints
        case 'sessionList':
          response = await axiosInstance.post(`/club/attendance?token=${token}`, bodyText);
          break;
        case 'sessionAdd':
          response = await axiosInstance.post(`/session/add?token=${token}`, bodyText);
          break;
        case 'sessionGetStudents':
          response = await axiosInstance.post(`/session/students?token=${token}`, bodyText);
          break;
        case 'sessionSign':
          response = await axiosInstance.post(`/session/sign?token=${token}`, bodyText);
          break;
        case 'sessionDelete':
          response = await axiosInstance.post(`/session/del?token=${token}`, bodyText);
          break;
        case 'sessionSearchMember':
          response = await axiosInstance.post(`/session/search-member?token=${token}`, bodyText);
          break;
        case 'sessionModifyName':
          response = await axiosInstance.post(`/session/modify-name?token=${token}`, bodyText);
          break;
        case 'sessionSetTime':
          response = await axiosInstance.post(`/session/set-time?token=${token}`, bodyText);
          break;

        // Club related endpoints
        case 'clubRanking':
          response = await axiosInstance.post('/club/ranking', bodyText);
          break;
        case 'clubStatistic':
          response = await axiosInstance.post('/club/statistic', bodyText);
          break;
        case 'clubSearch':
          response = await axiosInstance.post('/club/search', bodyText);
          break;
        case 'clubPresidentClubs':
          response = await axiosInstance.post(`/club/president-club?token=${token}`, bodyText);
          break;
        case 'clubGetClubDetail':
          response = await axiosInstance.post(`/club/detail?token=${token}`, bodyText);
          break;
          
        default:
          return NextResponse.json({ error: 'Invalid action', msg: action }, { status: 400 });
      }

      return NextResponse.json(response.data);
    } catch (error) {
      console.error('Request failed:', error);
      return NextResponse.json({ error: 'Request failed', details: (error as Error).message }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Invalid request data', details: (error as Error).message }, { status: 400 });
  }
}
