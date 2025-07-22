// components/Layout/PageWrapper.tsx
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import './Layout.css';

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
};

const pageTransition = {
    duration: 0.3,
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="layout">
            <main id="main-content" className="layout__content" tabIndex={-1}>
                <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default Layout