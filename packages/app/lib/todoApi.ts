// lib/todoApi.ts
import { createApi } from './createApi';

const todoApi = createApi(process.env.NEXT_PUBLIC_TODO_SERVICE_URL!);
export default todoApi;
