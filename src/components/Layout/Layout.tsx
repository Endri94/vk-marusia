import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from '../../context/AuthProvider';
import { useAuth } from '../../context/useAuth';
import AuthModal from '../AuthModal/AuthModal'; 
import './Layout.css';
const LayoutContent = () => {
    const location = useLocation(); // вызов один раз
    const { isAuthModalOpen, closeAuthModal } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]); // в зависимости кладём конкретное поле

    return (
        <div className="layout">
            <Header />
            <main id="main-content" className="layout__content" tabIndex={-1}>
                <Outlet />
            </main>
            <Footer />
            {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />}
        </div>
    );
};
export const Layout = () => {
    return (
        <AuthProvider>
            <LayoutContent />
        </AuthProvider>
    );
};
