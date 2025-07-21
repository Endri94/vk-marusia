import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Layout } from './components/Layout/Layout';
import { LoadingFallback } from './components/LoadingFallback/LoadingFallback';
import { useAuth } from './context/useAuth';
import AuthModal from './components/AuthModal/AuthModal';
import { AnimatePresence, motion } from 'framer-motion';
import { BackToTop } from './components/BackToTop/BackToTop';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const GenresPage = lazy(() => import('./pages/GenresPage/GenresPage'));
const GenrePage = lazy(() => import('./pages/GenrePage/GenrePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const MoviePage = lazy(() => import('./pages/MoviePage/MoviePage'));

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.3,
};

function App() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const location = useLocation();

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              element={
                <Layout />
              }
            >
              <Route
                index
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <HomePage />
                  </motion.div>
                }
              />
              <Route
                path="/genres"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <GenresPage />
                  </motion.div>
                }
              />
              <Route
                path="/genre/:key"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <GenrePage />
                  </motion.div>
                }
              />
              <Route
                path="/profile"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <ProfilePage />
                  </motion.div>
                }
              />
              <Route
                path="/movie/:id"
                element={
                  <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransition}
                  >
                    <MoviePage />
                  </motion.div>
                }
              />
            </Route>
            <Route
              path="*"
              element={
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={pageTransition}
                  style={{ padding: 20 }}
                >
                  404 | Not Found
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <BackToTop />

      {/* Глобальный модал авторизации */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
}

export default App;
