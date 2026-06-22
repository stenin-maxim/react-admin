import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';

interface AuthState {
    token: string | null;
    user: {
        ulid: string;
        name: string;
        city: string;
        avatar_url: string
    } | null;
}

const initialState: AuthState = {
    // Автоматически пытаемся достать сохраненный токен при старте приложения
    token: localStorage.getItem('token'),
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        // Слушаем успешное завершение эндпоинта login из authApi
        builder.addMatcher(
            authApi.endpoints.login.matchFulfilled,
            (state, action) => {
                const { accessToken, user } = action.payload.data;
                state.token = accessToken;
                state.user = user;

                localStorage.setItem('token', accessToken);
                localStorage.setItem('user', JSON.stringify(user));
            }
        );
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;