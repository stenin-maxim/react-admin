import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/app/store';

export interface DashboardStats {
    status: string;
    data: {
        users_online: number;
        users_total: number;
        users_new_today: number;
        user_unverified_count: number;
        products_pending: number;
        products_active: number;
        products_inactive: number;
        support_new_tickets: number;
        support_in_progress: number;
        messages_today_count: number;
        redis_cached_at: string;
    };
}

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, { getState }) => {
            // Автоматически берем актуальный токен из Redux State auth
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getDashboardStats: builder.query<DashboardStats, void>({
            query: () => '/dashboard/stats',
        }),
    }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;