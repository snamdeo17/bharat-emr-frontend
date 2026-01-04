import { create } from 'zustand';
import Cookies from 'js-cookie';
import { JWT_COOKIE_NAME, USER_COOKIE_NAME } from '../utils/constants';

export const useAuthStore = create((set) => ({
  user: JSON.parse(Cookies.get(USER_COOKIE_NAME) || 'null'),
  token: Cookies.get(JWT_COOKIE_NAME) || null,
  setAuth: (user, token) => {
    Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), { expires: 7 });
    Cookies.set(JWT_COOKIE_NAME, token, { expires: 7 });
    set({ user, token });
  },
  updateUser: (updatedUser) => {
    Cookies.set(USER_COOKIE_NAME, JSON.stringify(updatedUser), { expires: 7 });
    set({ user: updatedUser });
  },
  logout: () => {
    Cookies.remove(USER_COOKIE_NAME);
    Cookies.remove(JWT_COOKIE_NAME);
    set({ user: null, token: null });
  },
}));
