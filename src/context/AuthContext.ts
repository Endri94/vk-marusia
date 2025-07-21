// src/context/AuthContext.ts
import { createContext } from 'react';
import type { AuthContextProps } from './AuthProvider';

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
