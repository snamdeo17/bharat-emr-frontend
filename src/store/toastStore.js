import { create } from 'zustand';

export const useToastStore = create((set) => ({
  open: false,
  message: '',
  severity: 'info',
  showToast: (message, severity = 'info') => {
    set({ open: true, message, severity });
  },
  hideToast: () => {
    set({ open: false });
  },
}));
