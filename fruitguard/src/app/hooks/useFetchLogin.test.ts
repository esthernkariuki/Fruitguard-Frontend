import { renderHook, act, waitFor } from '@testing-library/react';
import { fetchLogin } from '../utils/fetchLogin';
import useFetchLogin from './useFetchLogin';

jest.mock('../utils/fetchLogin');

type LoginData = { id: number; email: string; password: string };
type LoginResponse = { token: string };

describe('useFetchLogin', () => {
  const userData: LoginData = { id: 1, email: '', password: '' };
  const mockResult: LoginResponse = { token: '' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct state', () => {
    const { result } = renderHook(() => useFetchLogin());
    expect(result.current).toEqual({
      loading: false,
      error: null,
      login: expect.any(Function),
    });
  });

  it('handles successful login', async () => {
    (fetchLogin as jest.Mock).mockResolvedValue(mockResult);
    const { result } = renderHook(() => useFetchLogin());

    let loginResult: LoginResponse | null = null;
    await act(async () => {
      loginResult = await result.current.login(userData);
    });

    expect(fetchLogin).toHaveBeenCalledWith(userData);
    expect(loginResult).toBe(mockResult);
    expect(result.current).toMatchObject({ loading: false, error: null });
  });

  it('handles login failure', async () => {
    (fetchLogin as jest.Mock).mockRejectedValue(new Error('Login failed'));
    const { result } = renderHook(() => useFetchLogin());

    let loginResult: LoginResponse | null = null;
    await act(async () => {
      loginResult = await result.current.login(userData);
    });

    expect(fetchLogin).toHaveBeenCalledWith(userData);
    expect(loginResult).toBe(null);
    expect(result.current).toMatchObject({ loading: false, error: 'Login failed' });
  });

  it('sets loading state during login', async () => {
    (fetchLogin as jest.Mock).mockImplementation(
      () => new Promise<LoginResponse>(resolve => setTimeout(() => resolve(mockResult), 100))
    );
    const { result } = renderHook(() => useFetchLogin());
    let loginPromise: Promise<LoginResponse | null>;

    await act(async () => {
      loginPromise = result.current.login(userData);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await act(async () => {
      await loginPromise;
    });

    expect(result.current.loading).toBe(false);
  });
});