import { configureStore } from '@reduxjs/toolkit';

import { authApi } from '@/features/auth/authApi';
import { dashboardApi } from '@/features/dashboard/dashboardApi';
import { usersApi } from '@/features/users/usersApi';
import authReducer from '@/features/auth/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer, // Слайс для синхронного состояния (токен, юзер)
        [authApi.reducerPath]: authApi.reducer, // Эндпоинты RTK Query
        [dashboardApi.reducerPath]: dashboardApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
    },
    // Добавление middleware обязательно для корректной работы кэширования
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            dashboardApi.middleware,
            usersApi.middleware,
        ),
});

// Настройка типов для хуков useDispatch и useSelector (если понадобятся в будущем)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;