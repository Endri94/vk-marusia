import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { LoadingFallback } from './components/LoadingFallback/LoadingFallback';
import { AnimatePresence } from 'framer-motion';
import { BackToTop } from './components/BackToTop/BackToTop';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { useAuth } from './context/useAuth';
import AuthModal from './components/AuthModal/AuthModal';
import { Layout } from './components/Layout/Layout';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const GenresPage = lazy(() => import('./pages/GenresPage/GenresPage'));
const GenrePage = lazy(() => import('./pages/GenrePage/GenrePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const MoviePage = lazy(() => import('./pages/MoviePage/MoviePage'));


function App() {
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const location = useLocation();

  return (
    <>
      <Header />
      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="popLayout" initial={false}>
          <Routes location={location}>
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/genres"
              element={
                <Layout>
                  <GenresPage />
                </Layout>
              }
            />
            <Route
              path="/genre/:key"
              element={
                <Layout>
                  <GenrePage />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <ProfilePage />
                </Layout>
              }
            />
            <Route
              path="/movie/:id"
              element={
                <Layout>
                  <MoviePage />
                </Layout>
              }
            />
            <Route
              path="*"
              element={
                <Layout>
                  <p>
                    404 | Not Found
                  </p>

                </Layout>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Footer />
      <BackToTop />
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </>
  );
}


export default App;
