import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import querystring from 'querystring';
const BASE_URL_BETA_AUTH = 'http://43.143.122.150:8000';


const axiosInstance = axios.create({
    baseURL: BASE_URL_BETA_AUTH,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

// POST 请求处理函数
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        // console.log(request)
        console.log('Action:', action);

        // 读取请求体
        const bodyText = await request.text();
        const body = querystring.parse(bodyText);

        console.log('Received body:', body);

        if (!action) {
            return NextResponse.json({ error: 'Action is required' }, { status: 400 });
        }

        try {
            let response;
            switch (action) {
                case 'checkBetaStatus':
                    response = await axiosInstance.post(`/auth/check_id`, bodyText);
                    break;
                default:
                    return NextResponse.json({ error: 'Invalid action', msg: action }, { status: 400 });
            }

            return NextResponse.json(response.data);
        } catch (error) {
            console.error('Request failed:', error);
            // Assert error as Error to access message property
            return NextResponse.json({ error: 'Request failed', details: (error as Error).message }, { status: 500 });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        // Assert error as Error to access message property
        return NextResponse.json({ error: 'Invalid request data', details: (error as Error).message }, { status: 400 });
    }
}
