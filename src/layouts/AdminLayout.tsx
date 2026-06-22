import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '@/app/store';
import { logout } from '@/features/auth/authSlice';
import { Sidebar } from './components/Sidebar';
import styles from './AdminLayout.module.scss';

export const AdminLayout = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state: RootState) => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className={styles.adminDashboard}>
            <Sidebar />
            <div className={styles.mainContent}>
                <header className={styles.appHeader}>
                    <div className={styles.userInfo}>
                        <span>Вы вошли как: <b>{user?.name}</b></span>
                        <button className={styles.logoutButton} onClick={() => dispatch(logout())}>
                            Выйти
                        </button>
                    </div>
                </header>

                <main className={styles.pageBody}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};