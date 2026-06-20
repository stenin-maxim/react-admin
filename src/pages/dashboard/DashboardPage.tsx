import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useGetDashboardStatsQuery } from '@/features/dashboard/dashboardApi';
import styles from "./Dashboard.module.scss";

export const DashboardPage = () => {
    const token = useSelector((state: RootState) => state.auth.token);

    // Запрос выполнится только если token существует (skip: true заблокирует запрос)
    const { data, isLoading, error, refetch } = useGetDashboardStatsQuery(undefined, {
        skip: !token,
    });

    if (isLoading) {
        return <div className={styles.dashboardContainer}>Загрузка статистики из Redis...</div>;
    }

    if (error) {
        return (
            <div className={styles.dashboardContainer} style={{ color: "red" }}>
                Ошибка загрузки данных бэкенда
            </div>
        );
    }

    // data — это весь объект ответа Laravel API (DashboardStats)
    // Внутренние данные лежат в data.data согласно вашему интерфейсу
    const stats = data?.data;

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardHeader}>
                <h1>Панель управления</h1>
                <button className={styles.refreshButton} onClick={() => refetch()}>
                    Обновить кэш
                </button>
            </div>

            {/* Сетка карточек */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Всего пользователей (MySQL)</h3>
                    <p className={styles.statValue}>{stats?.users_total ?? 0}</p>
                </div>

                <div className={styles.statCard}>
                    <h3>Активные сессии (Redis)</h3>
                    <p className={`${styles.statValue} ${styles.highlight}`}>
                        {stats?.users_online ?? 0}
                    </p>
                </div>
            </div>

            {/* Время обновления кэша Redis */}
            {stats?.redis_cached_at && (
                <div className={styles.cacheInfo}>
                    Данные актуальны на: {new Date(stats.redis_cached_at).toLocaleString()} (из кэша Redis)
                </div>
            )}
        </div>
    );
};