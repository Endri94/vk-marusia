import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import * as useAuthModule from '../../../context/useAuth';
import { Layout } from '../Layout';

// Определяем тип для возвращаемого значения useAuth
interface AuthContextValue {
  isAuthModalOpen: boolean;
  closeAuthModal: () => void;
}

vi.mock('../../../context/useAuth');

describe('Layout', () => {
  const scrollToMock = vi.fn();
  const closeAuthModalMock = vi.fn();

  beforeAll(() => {
    global.scrollTo = scrollToMock;
  });

  const TestPage = () => <div data-testid="test-page">Test Content</div>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Используем type assertion для мока
    (useAuthModule.useAuth as vi.Mock<AuthContextValue>).mockReturnValue({
      isAuthModalOpen: false,
      closeAuthModal: closeAuthModalMock,
    });
  });

  const renderWithRouter = (initialPath = '/') =>
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="*" element={<Layout />}>
            <Route index element={<TestPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

  it('отображает Header, Footer и Outlet', () => {
    renderWithRouter();
    expect(screen.getByTestId('test-page')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('вызывает scrollTo при изменении pathname', () => {
    const { rerender } = renderWithRouter('/initial');
    rerender(
      <MemoryRouter initialEntries={['/next']}>
        <Routes>
          <Route path="*" element={<Layout />}>
            <Route index element={<TestPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
  });

  it('отображает AuthModal, если isAuthModalOpen true', () => {
    (useAuthModule.useAuth as vi.Mock<AuthContextValue>).mockReturnValue({
      isAuthModalOpen: true,
      closeAuthModal: closeAuthModalMock,
    });
    renderWithRouter();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('не отображает AuthModal, если isAuthModalOpen false', () => {
    renderWithRouter();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});