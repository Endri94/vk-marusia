import axios from 'axios';
import type { Movie } from '../types';


const api = axios.create({
  baseURL: 'https://cinemaguide.skillbox.cc',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // обязательно для сессионной авторизации
});

type GetMoviesParams = {
  title?: string;
  genre?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
};

// Случайный фильм
export const getRandomMovie = async () => {
  const res = await api.get('/movie/random');
  return res.data;
};

// Топ 10 фильмов
export const getTop10Movies = async () => {
  const res = await api.get('/movie/top10');
  return res.data;
};

// Все жанры
export const getGenres = async () => {
  const res = await api.get('/movie/genres');
  return res.data;
};

// Фильмы по параметрам
export const getMovies = async (params: GetMoviesParams) => {
  const query = new URLSearchParams();
  if (params.title) query.append('title', params.title)
  if (params.genre) query.append('genre', params.genre);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.offset) query.append('offset', params.offset.toString());

  const res = await api.get(`/movie?${query.toString()}`);
  return res.data; // Предполагается, что возвращается массив фильмов
};

// Фильм по ID
export const getMovieById = async (id: number | string) => {
  const res = await api.get(`/movie/${id}`);
  return res.data;
};

//  ЛОГИН
export const login = async (data: { email: string; password: string }) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

//  РЕГИСТРАЦИЯ
export const register = async (data: {
  name: string;
  surname: string;
  email: string;
  password: string;
}) => {
  const res = await api.post('/user', data);
  return res.data;
};

// ЛОГАУТ
export const logout = async () => {
  await api.get('/auth/logout');
};

//  ПОЛУЧЕНИЕ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ
export const getCurrentUser = async () => {
  try {
    const res = await api.get('/profile');
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

// Добавление фильма в избранное 
export const addFavoriteMovie = async (movieId: number | string) => {
  const body = `id=${encodeURIComponent(movieId)}`;

  const res = await api.post('/favorites', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return res.data;
};

// Получение избранных фильмов текущего пользователя
export const getFavoriteMovies = async (): Promise<Movie[]> => {
  const response = await api.get('/favorites');
  return response.data;
};

// Удаление фильма из избранного
export const removeFavoriteMovie = async (movieId: number | string) => {
  await api.delete(`/favorites/${movieId}`);
};