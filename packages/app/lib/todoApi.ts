// lib/todoApi.ts
import { createApi } from './createApi';

const todoApi = createApi(process.env.NEXT_PUBLIC_TODO_SERVICE_URL!);

todoApi.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
            window.location.href = `/login`;

    }
    return Promise.reject(err);
  }
);

export default todoApi;
