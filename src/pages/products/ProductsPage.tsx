import { useState } from 'react';
import { useGetProductsQuery } from '@/features/products/productsApi';
import { ImageOff } from 'lucide-react';
import styles from './Products.module.scss';

export const ProductsPage = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const { data, isLoading, isFetching, error } = useGetProductsQuery({ page, search });

    if (isLoading) return <div className={styles.productsContainer}>Загрузка списка объявлений...</div>;
    if (error) return <div className={styles.productsContainer} style={{ color: 'red' }}>Ошибка при загрузке объявлений</div>;

    const pagination = data?.data;
    const products = pagination?.items ?? [];

    // Генерация числового массива страниц
    const pageNumbers = [];
    if (pagination) {
        for (let i = 1; i <= pagination.last_page; i++) {
            pageNumbers.push(i);
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Сбрасываем страницу на первую при каждом новом поиске
    };

    return (
        <div className={styles.productsContainer}>
            <h1 className={isFetching ? styles.isFetching : ''}>
                Список объявлений {isFetching && '...'}
            </h1>

            <div className={styles.searchWrapper}>
                <input 
                    type="text"
                    placeholder="Поиск по названию объявления..."
                    className={styles.searchInput}
                    value={search}
                    onChange={handleSearchChange}
                />
            </div>

            <div className={`${styles.tableWrapper} ${isFetching ? styles.isFetchingTable : ''}`}>
                <table className={styles.productsTable}>
                    <thead>
                        <tr>
                            <th>Фото</th>
                            <th>ULID</th>
                            <th>Название</th>
                            <th>Цена</th>
                            <th>Город</th>
                            <th>Статус</th>
                            <th>Продавец</th>
                            <th>Категория</th>
                            <th>Подкатегория</th>
                            <th>Состояние</th>
                            <th>Тип объяв.</th>
                            <th>Кол. просм.</th>
                            <th>Дата публикации</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.ulid}>
                                <td>
                                    {product.image_path ? (
                                        <img 
                                            src={product.image_path}
                                            alt={product.name} 
                                            className={styles.productImg}
                                        />
                                    ) : (
                                        <div className={styles.productImgPlaceholder}>
                                            <ImageOff size={16} />
                                        </div>
                                    )}
                                </td>

                                <td className={styles.ulidCell}>{product.ulid}</td>
                                <td className={styles.nameCell} title={product.name}>{product.name}</td>
                                <td className={styles.priceCell}>{product.price.toLocaleString()} ₽</td>
                                <td>{product.city || '—'}</td>

                                <td>
                                    <span className={`${styles.statusBadge} ${styles[product.status]}`}>
                                        {product.status === 'active' ? 'Активен' : product.status === 'pending' ? 'Модерация' : 'Архив'}
                                    </span>
                                </td>

                                <td className={styles.ownerInfo}>
                                    {product.user ? product.user.name : <span className={styles.deletedUser}>Удален</span>}
                                </td>

                                <td>{product.category || '—'}</td>
                                <td>{product.subcategory || '—'}</td>
                                <td>{product.item_condition || '—'}</td>
                                <td>{product.type_ad || '—'}</td>
                                <td>{product.views_count ?? 0}</td>
                                <td>{product.created_at_formatted}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.last_page > 1 && (
                <div className={styles.paginationWrapper}>
                    <div>
                        Всего объявлений: <b>{pagination.total}</b>
                    </div>

                    <div className={styles.buttonsBlock}>
                        <button 
                            className={styles.pageButton}
                            onClick={() => setPage(p => Math.max(p - 1, 1))}
                            disabled={page === 1 || isFetching}
                        >
                            «
                        </button>

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