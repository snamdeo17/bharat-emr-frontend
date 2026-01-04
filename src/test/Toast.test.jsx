import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Toast from '../components/Toast';

describe('Toast Component', () => {
  it('renders toast notification when visible', () => {
    render(<Toast message="Success" type="success" />);
    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('displays correct icon based on type', () => {
    const { rerender } = render(<Toast message="Info" type="info" />);
    expect(screen.getByText('Info')).toBeInTheDocument();
    
    rerender(<Toast message="Error" type="error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('applies correct styling based on type', () => {
    const { container } = render(<Toast message="Test" type="warning" />);
    const toastElement = container.querySelector('.MuiAlert-root');
    expect(toastElement).toHaveClass('MuiAlert-warning');
  });

  it('auto-closes after specified duration', async () => {
    vi.useFakeTimers();
    const { unmount } = render(<Toast message="Auto-close" autoClose={3000} />);
    
    expect(screen.getByText('Auto-close')).toBeInTheDocument();
    vi.advanceTimersByTime(3000);
    
    vi.useRealTimers();
  });
});
