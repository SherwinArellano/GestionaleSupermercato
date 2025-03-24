import { env } from '@/data/env/server';
import axios from 'axios';

const instance = axios.create({
  baseURL: env.DB_BASE_URL,
});

if (env.NODE_ENV === 'development') {
  instance.interceptors.request.use((request) => {
    console.log(
      `[DEV] Request: ${request.method?.toUpperCase()} ${request.url}`
    );
    return request;
  });

  instance.interceptors.response.use((response) => {
    // console.log(`[DEV] Response (${response.config.url}):`, response.data);
    return response;
  });
}

export default instance;
