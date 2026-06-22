import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useGetDashboardStatsQuery } from '@/features/dashboard/dashboardApi';
import { Users, Package, HelpCircle, Activity } from 'lucide-react';
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

    const stats = data?.data;

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardHeader}>
                <h1>Панель управления</h1>
                <button className={styles.refreshButton} onClick={() => refetch()}>
                    Обновить кэш
                </button>
            </div>


            {/* СЕКЦИЯ 1: ПОЛЬЗОВАТЕЛИ */}
            <div className={styles.statsSection}>
                <h2><Users size={20} /> Пользователи и сессии</h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <h3>Всего пользователей (MySQL)</h3>
                        <p className={styles.statValue}>{stats?.users_total ?? 0}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Новых за день</h3>
                        <p className={styles.statValue}>{stats?.users_new_today ?? 0}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Не подтвердили E-mail</h3>
                        <p className={styles.statValue}>{stats?.user_unverified_count ?? 0}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Активные сессии (Redis)</h3>
                        <p className={`${styles.statValue} ${styles.highlight}`}>
                            {stats?.users_online ?? 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* СЕКЦИЯ 2: ТОВАРЫ */}
            <div className={styles.statsSection}>
                <h2><Package size={20} /> Каталог товаров</h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <h3>Всего активных товаров</h3>
                        <p className={styles.statValue}>{stats?.products_active ?? 0}</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Товаров на модерации</h3>
                        <p className={`${styles.statValue} ${stats?.products_pending ? styles.warningText : ''}`}>
                            {stats?.products_pending ?? 0}
                        </p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Снято с публикации</h3>
                        <p className={styles.statValue}>{stats?.products_inactive ?? 0}</p>
                    </div>
                </div>
            </div>

            {/* СЕКЦИЯ 3: ТЕХПОДДЕРЖКА */}
            <div className={styles.statsSection}>
                <h2><HelpCircle size={20} /> Техническая поддержка</h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <h3>Новые тикеты</h3>
                        <p className={`${styles.statValue} ${stats?.support_new_tickets ? styles.dangerText : ''}`}>
                            {stats?.support_new_tickets ?? 0}
                        </p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>В процессе решения</h3>
                        <p className={styles.statValue}>{stats?.support_in_progress ?? 0}</p>
                    </div>
                </div>
            </div>

            {/* СЕКЦИЯ 4: АКТИВНОСТЬ ПЛАТФОРМЫ */}
            <div className={styles.statsSection}>
                <h2><Activity size={20} /> Активность платформы</h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <h3>Сообщений в чатах за сегодня</h3>
                        <p className={styles.statValue}>{stats?.messages_today_count ?? 0}</p>
                    </div>
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