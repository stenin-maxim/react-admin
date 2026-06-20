import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    status: string;
    message: string;
    data: {
        accessToken: string;
        tokenType: string;
        user: {
            ulid: string;
            name: string;
            city: string;
            avatar_url: string
            // добавьте сюда другие поля из UserResource, если необходимо
        };
    };
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
    endpoints: (builder) => ({
        // Используем mutation для POST запросов изменения/проверки данных
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginMutation } = authApi;