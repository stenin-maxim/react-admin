import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { AdminLayout } from '@/layouts/AdminLayout';
import { LoginPage } from '@/pages/login/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { UsersPage } from '@/pages/users/UsersPage';
import { ProductsPage } from '@/pages/products/ProductsPage'; 
import './App.scss';

function App() {
    const { token } = useSelector((state: RootState) => state.auth);

    return (
        <BrowserRouter>
            <Routes>
                {/* Публичные роуты */}
                <Route 
                    path="/login" 
                    element={token ? <Navigate to="/" replace /> : <LoginPage />} 
                />

                {/* Защищенные роуты админки (доступны только с токеном) */}
                <Route path="/" element={<AdminLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="products" element={<ProductsPage />} />
                </Route>

                {/* Автоматический редирект для любых несуществующих страниц */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;