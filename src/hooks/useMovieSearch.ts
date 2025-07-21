import { useState, useEffect } from 'react';
import { getMovies } from '../api/api';
import type { Movie } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


export const useMovieSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (query.trim().length === 0) {
            setResults([]);
            return;
        }
        const timer = setTimeout(async () => {
            setIsLoading(true);

            try {
                const [data] = await Promise.all([
                    getMovies({ title: query }),
                    delay(1000), // гарантированная пауза в 1 секунду
                ]);
                setResults(data);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500); // debounce

        return () => clearTimeout(timer);
    }, [query]);

    return { query, setQuery, results, isLoading };
};
