import { NavLink } from 'react-router-dom';
import styles from '../AdminLayout.module.scss';
import { BarChart3, Users, Package } from 'lucide-react';

export const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>⚡ Панель Админа</div>
            <nav>
                <ul className={styles.menu}>
                    <li>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                isActive ? `${styles.menuLink} ${styles.activeLink}` : styles.menuLink
                            }
                        >
                            <span className={styles.linkContent}>
                                <BarChart3 size={18} />
                                Главная статистика
                            </span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/users" 
                            className={({ isActive }) => 
                                isActive ? `${styles.menuLink} ${styles.activeLink}` : styles.menuLink
                            }
                        >
                            <span className={styles.linkContent}>
                                <Users size={18} />
                                Пользователи (MySQL)
                            </span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/products" 
                            className={({ isActive }) => 
                                isActive ? `${styles.menuLink} ${styles.activeLink}` : styles.menuLink
                            }
                        >
                            <span className={styles.linkContent}>
                                <Package size={18} />
                                Список товаров
                            </span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};