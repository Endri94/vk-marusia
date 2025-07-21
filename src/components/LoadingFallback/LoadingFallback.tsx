// components/LoadingFallback/LoadingFallback.tsx
import './LoadingFallback.css'; // Создадим этот файл ниже

export const LoadingFallback = () => {
    return (
        <div className="loading-fallback" aria-live="polite" aria-busy="true">
            <div className="loading-spinner"></div>
            <p className="loading-text">Загрузка страницы...</p>
        </div>
    );
};