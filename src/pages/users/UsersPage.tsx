import { useState } from 'react';
import { useGetUsersQuery } from '@/features/users/usersApi';
import styles from './UsersPage.module.scss';

export const UsersPage = () => {
    const [page, setPage] = useState(1);
    const { data, isLoading, isFetching, error } = useGetUsersQuery(page);

    if (isLoading) return <div className={styles.usersContainer}>Загрузка списка пользователей...</div>;
    if (error) return <div className={styles.usersContainer} style={{ color: 'red' }}>Ошибка при загрузке пользователей</div>;

    const pagination = data?.data;
    const users = pagination?.items ?? [];
    
    // Генерируем точный массив страниц: [1, 2, 3...] на основе ответа Laravel
    const pageNumbers = [];
    if (pagination) {
        for (let i = 1; i <= pagination.last_page; i++) {
            pageNumbers.push(i);
        }
    }

    return (
        <div className={styles.usersContainer}>
            <h1 style={{ opacity: isFetching ? 0.6 : 1 }}>
                Список пользователей {isFetching && '...'}
            </h1>

            <div className={styles.tableWrapper} style={{ opacity: isFetching ? 0.8 : 1 }}>
                <table className={styles.usersTable}>
                    <thead>
                        <tr>
                            <th>Аватар</th>
                            <th>ULID</th>
                            <th>Имя</th>
                            <th>Email</th>
                            <th>Подтвержден</th>
                            <th>Телефон</th>
                            <th>Город</th>
                            <th>Роли</th>
                            <th>Дата регистрации</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.ulid}>
                                <td>
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.name} className={styles.avatarImg} />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>{user.name.charAt(0)}</div>
                                    )}
                                </td>
                                <td className={styles.ulidCell} title={user.ulid}>{user.ulid}</td>
                                <td>{user.name}</td>
                                <td>{user.email ?? <span className={styles.hiddenCell}>Скрыто</span>}</td>
                                <td>
                                    <span className={`${styles.badge} ${user.email_verified_at ? styles.verified : styles.notVerified}`}>
                                        {user.email_verified_at ? 'Да' : 'Нет'}
                                    </span>
                                </td>
                                <td>{user.phone ?? <span className={styles.hiddenCell}>Скрыто</span>}</td>
                                <td>{user.city || '—'}</td>
                                <td>
                                    {user.roles && user.roles.length > 0 ? (
                                        user.roles.map((role) => (
                                            <span key={role.id} className={`${styles.badge} ${styles.role}`}>{role.role_name}</span>
                                        ))
                                    ) : (
                                        <span className={styles.badge} style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>User</span>
                                    )}
                                </td>
                                <td>{user.created_at_formatted}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Блок ПАГИНАЦИИ с точными кнопками */}
            {pagination && pagination.last_page > 1 && (
                <div className={styles.paginationWrapper}>
                    <div className={styles.paginationInfo}>
                        Показано с <span>{((page - 1) * pagination.per_page) + 1}</span> по{' '}
                        <span>{Math.min(page * pagination.per_page, pagination.total)}</span> из{' '}
                        <span>{pagination.total}</span> пользователей
                    </div>

                    <div className={styles.paginationButtons}>
                        {/* Кнопка Назад */}
                        <button 
                            className={styles.pageButton}
                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                            disabled={page === 1 || isFetching}
                        >
                            «
                        </button>

                        {/* Точные числовые кнопки */}
                        {pageNumbers.map((pNum) => (
                            <button
                                key={pNum}
                                className={`${styles.pageButton} ${page === pNum ? styles.activePage : ''}`}
                                onClick={() => setPage(pNum)}
                                disabled={isFetching}
                            >
                                {pNum}
                            </button>
                        ))}

                        {/* Кнопка Вперед */}
                        <button 
                            className={styles.pageButton}
                            onClick={() => setPage(p => Math.min(p + 1, pagination.last_page))}
                            disabled={page === pagination.last_page || isFetching}
                        >
                            »
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};