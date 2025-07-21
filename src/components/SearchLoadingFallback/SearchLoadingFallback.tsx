// components/SearchLoadingFallback/SearchLoadingFallback.tsx
import './SearchLoadingFallback.css';

const SKELETON_COUNT = 5;

export const SearchLoadingFallback = () => {
    return (
        <div className="search-loading-fallback" aria-live="polite" aria-busy="true" role="status" data-testid="search-loading-fallback">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div
                    key={i}
                    className="search-skeleton-item shimmer"
                    style={{ animationDelay: `${i * 150}ms` }}
                >
                    <div className="skeleton-poster" />
                    <div className="skeleton-details">
                        <div className="skeleton-title" />
                        <div className="skeleton-meta">
                            <div className="skeleton-rating" />
                            <div className="skeleton-year" />
                            <div className="skeleton-genres" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
