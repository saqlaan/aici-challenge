// lib/userApi.ts
import { createApi } from './createApi';

const userApi = createApi(process.env.NEXT_PUBLIC_USER_SERVICE_URL!);
export default userApi;
