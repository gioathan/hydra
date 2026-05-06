import { create } from 'zustand';
import type { UserDto } from '../../types';

interface AuthState {
  token: string | null;
  user: UserDto | null;
  customerId: string | null;
  isRehydrated: boolean;
  setAuth: (token: string, user: UserDto, customerId: string) => void;
  clearAuth: () => void;
  setRehydrated: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  customerId: null,
  isRehydrated: false,
  setAuth: (token, user, customerId) => set({ token, user, customerId }),
  clearAuth: () => set({ token: null, user: null, customerId: null }),
  setRehydrated: () => set({ isRehydrated: true }),
}));
