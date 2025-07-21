import './AuthModal.css';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/useAuth';
import type { AxiosError } from 'axios';

import closeModalIcon from '../../assets/icons/close-modal.svg';
import emailIcon from '../../assets/icons/mail-modal.svg';
import passwordIcon from '../../assets/icons/password-modal.svg';
import userIcon from '../../assets/icons/profile-modal.svg';
import logoIcon from '../../assets/icons/logo-modal.png';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export const AuthModal = ({ isOpen, onClose }: Props) => {
    const { login, register } = useAuth();
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validate = () => {
        const newErrors: typeof errors = {};

        if (isRegister) {
            if (!form.name.trim()) newErrors.name = 'Введите имя';
            if (!form.surname.trim()) newErrors.surname = 'Введите фамилию';
        }

        if (!form.email.trim()) newErrors.email = 'Введите email';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            newErrors.email = 'Некорректный email';

        if (!form.password) newErrors.password = 'Введите пароль';
        else if (form.password.length < 6 || !/\d/.test(form.password))
            newErrors.password = 'Минимум 6 символов и 1 цифра';

        if (isRegister) {
            if (!form.confirmPassword) newErrors.confirmPassword = 'Подтвердите пароль';
            else if (form.password !== form.confirmPassword)
                newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (isRegister) {
                await register(form.name, form.surname, form.email, form.password);
                setIsSuccess(true);
            } else {
                await login(form.email, form.password);
                onClose();
            }
        } catch (error) {
            // Проверяем, что ошибка — это ошибка axios
            const err = error as AxiosError<{ error?: string; message?: string }>;

            const message =
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Неверный пароль';

            const lowerMsg = message.toLowerCase();

            if (isRegister) {
                if (lowerMsg.includes('already') || lowerMsg.includes('существует')) {
                    setErrors({ email: 'Этот email уже зарегистрирован.' });
                } else {
                    setErrors({ email: message });
                }
            } else {
                if (
                    lowerMsg.includes('user not found') ||
                    lowerMsg.includes('нет пользователя') ||
                    lowerMsg.includes('не найден')
                ) {
                    setErrors({ email: 'Пользователь с таким email не найден' });
                } else if (
                    lowerMsg.includes('invalid') ||
                    lowerMsg.includes('неверный') ||
                    lowerMsg.includes('пароль')
                ) {
                    setErrors({ password: 'Неверный пароль' });
                } else {
                    setErrors({ email: message });
                }
            }
        }
    };
    const handleInput = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
        setErrors({ ...errors, [field]: '' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="auth-modal-overlay show"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="auth-modal" role="dialog"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.9 }}
                    >
                        <img src={logoIcon} alt="logo-marusia" />
                        <button className="auth-modal__close" onClick={onClose}>
                            <img src={closeModalIcon} alt="Закрыть" />
                        </button>

                        <AnimatePresence mode="wait">
                            {!isSuccess ? (
                                <motion.div
                                    key={isRegister ? 'register' : 'login'}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h2 className="auth-modal__title">{isRegister ? 'Регистрация' : 'Авторизация'}</h2>
                                    <form className="auth-modal__form" onSubmit={handleSubmit}>
                                        {isRegister && (
                                            <>
                                                <div className={`input-group ${errors.name ? 'input-error' : ''}`}>
                                                    <img src={userIcon} className="input-group__icon" />
                                                    <input
                                                        type="text"
                                                        placeholder="Имя"
                                                        value={form.name}
                                                        onChange={(e) => handleInput('name', e.target.value)}
                                                    />
                                                    {errors.name && <div className="error-text">{errors.name}</div>}
                                                </div>

                                                <div className={`input-group ${errors.surname ? 'input-error' : ''}`}>
                                                    <img src={userIcon} className="input-group__icon" />
                                                    <input
                                                        type="text"
                                                        placeholder="Фамилия"
                                                        value={form.surname}
                                                        onChange={(e) => handleInput('surname', e.target.value)}
                                                    />
                                                    {errors.surname && <div className="error-text">{errors.surname}</div>}
                                                </div>
                                            </>
                                        )}

                                        <div className={`input-group ${errors.email ? 'input-error' : ''}`}>
                                            <img src={emailIcon} className="input-group__icon" />
                                            <input
                                                type="email"
                                                placeholder="Электронная почта"
                                                value={form.email}
                                                onChange={(e) => handleInput('email', e.target.value)}
                                            />
                                            {errors.email && <div className="error-text">{errors.email}</div>}
                                        </div>

                                        <div className={`input-group ${errors.password ? 'input-error' : ''}`}>
                                            <img src={passwordIcon} className="input-group__icon" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Пароль"
                                                value={form.password}
                                                onChange={(e) => handleInput('password', e.target.value)}
                                            />
                                            {errors.password && <div className="error-text">{errors.password}</div>}
                                        </div>

                                        {isRegister && (
                                            <div className={`input-group ${errors.confirmPassword ? 'input-error' : ''}`}>
                                                <img src={passwordIcon} className="input-group__icon" />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Подтвердите пароль"
                                                    value={form.confirmPassword}
                                                    onChange={(e) => handleInput('confirmPassword', e.target.value)}
                                                />
                                                {errors.confirmPassword && (
                                                    <div className="error-text">{errors.confirmPassword}</div>
                                                )}
                                                <button
                                                    type="button"
                                                    className="auth-modal__showpassword--btn"
                                                    onClick={() => setShowPassword((prev) => !prev)}
                                                >
                                                    {showPassword ? 'Скрыть' : 'Показать'}
                                                </button>
                                            </div>
                                        )}
                                        <button type="submit" className="auth-modal__submit-btn">
                                            {isRegister ? 'Создать аккаунт' : 'Войти'}
                                        </button>
                                    </form>

                                    <button
                                        type="button"
                                        className="auth-modal__toggle-btn"
                                        onClick={() => {
                                            setIsRegister(!isRegister);
                                            setForm({
                                                name: '',
                                                surname: '',
                                                email: '',
                                                password: '',
                                                confirmPassword: ''
                                            });
                                            setErrors({});
                                            setShowPassword(false);
                                        }}
                                    >
                                        {isRegister ? 'У меня есть пароль' : 'Регистрация'}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="auth-modal__success"
                                >
                                    <h2 className="auth-modal__success-title">Регистрация завершена</h2>
                                    <div className="auth-modal__success-content">
                                        <p className='auth-modal__success-descr'>Используйте вашу электронную почту для входа</p>
                                    </div>
                                    <button
                                        className="auth-modal__success-btn"
                                        onClick={() => {
                                            setIsRegister(false);
                                            setIsSuccess(false);
                                            setForm({
                                                name: '',
                                                surname: '',
                                                email: form.email, // Сохраняем email
                                                password: '',
                                                confirmPassword: ''
                                            });
                                            setErrors({});
                                            setShowPassword(false);
                                        }}
                                    >
                                        Войти
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
