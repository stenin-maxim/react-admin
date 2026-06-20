import React, { useState } from "react";
import { useLoginMutation } from "@/features/auth/authApi";
import styles from "./Login.module.scss";

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, { isLoading, error }] = useLoginMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // .unwrap() возвращает чистый промис данных или генерирует ошибку для catch
            await login({ email, password }).unwrap();
        } catch (err) {
            console.error("Ошибка авторизации:", err);
        }
    };

    // Приведение типа ошибки для безопасного отображения сообщения
    const rtkError = error as any;

    return (
        <div className={styles.loginPageContainer}>
            <div className={styles.loginCard}>
                <h2>Вход</h2>
                
                {rtkError && (
                    <div className={styles.errorMessage}>
                        {rtkError?.data?.message || "Неверный логин или пароль"}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formGroup + " " + styles.passwordGroup}>
                        <label>Пароль</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? "Вход..." : "Войти"}
                    </button>
                </form>
            </div>
        </div>
    );
};