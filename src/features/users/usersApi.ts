import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '@/app/store';

export interface Role {
    id: number;
    role_name: string;
}

export interface User {
    ulid: string;
    name: string;
    email?: string; 
    email_verified_at: string | null;
    phone?: string | null;
    show_phone: boolean;
    city: string | null;
    created_at: string | null;
    created_at_formatted: string;
    avatar_url?: string | null;
    roles?: Role[];
}

interface PaginatedUsersResponse {
    status: string;
    message: string;
    data: {
        items: User[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
}

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getUsers: builder.query<PaginatedUsersResponse, number>({
            query: (page = 1) => `/users?page=${page}`,
        }),
    }),
});

export const { useGetUsersQuery } = usersApi;