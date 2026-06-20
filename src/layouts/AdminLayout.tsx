import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import styles from './AdminLayout.module.scss';

export const AdminLayout = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state: RootState) => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className={styles.appLayout}>
            <header className={styles.appHeader}>
                <h2>Панель управления (Админка)</h2>
                <div className={styles.userInfo}>
                    <span>Вы вошли как: <b>{user?.name}</b></span>
                    <button className={styles.logoutButton} onClick={() => dispatch(logout())}>
                        Выйти
                    </button>
                </div>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
};