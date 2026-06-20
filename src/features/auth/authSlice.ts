import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
        setCredentials: (
            state,
            action: PayloadAction<{ token: string; user: AuthState['user'] }>
        ) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            
            // Сохраняем в браузере, чтобы сессия не сбрасывалась при перезагрузке страницы
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
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

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;