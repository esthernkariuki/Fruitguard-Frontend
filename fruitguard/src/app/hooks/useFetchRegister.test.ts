import { renderHook, act, waitFor } from '@testing-library/react';
import { fetchRegister } from '../utils/fetchRegister';
import useFetchRegister from './useFetchRegister';

jest.mock('../utils/fetchRegister');
describe('useFetchRegister', () => {
  const userData = { id: 1, firstName: '', lastName: '', email: '', password: '' };
  const mockResult = { token: '' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct state', () => {
    const { result } = renderHook(() => useFetchRegister());
    expect(result.current).toEqual({ loading: false, error: null, register: expect.any(Function) });
  });

  it('handles successful registration', async () => {
    (fetchRegister as jest.Mock).mockResolvedValue(mockResult);
    const { result } = renderHook(() => useFetchRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(userData);
    });

    expect(fetchRegister).toHaveBeenCalledWith(userData);
    expect(registerResult).toBe(mockResult);
    expect(result.current).toMatchObject({ loading: false, error: null });
  });

  it('handles registration failure', async () => {
    (fetchRegister as jest.Mock).mockRejectedValue(new Error('Registration failed'));
    const { result } = renderHook(() => useFetchRegister());

    let registerResult;
    await act(async () => {
      registerResult = await result.current.register(userData);
    });

    expect(fetchRegister).toHaveBeenCalledWith(userData);
    expect(registerResult).toBe(null);
    expect(result.current).toMatchObject({ loading: false, error: 'Registration failed' });
  });

  it('sets loading state during registration', async () => {
    (fetchRegister as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockResult), 100)));
    const { result } = renderHook(() => useFetchRegister());

    let registerPromise: Promise<unknown>;
    await act(async () => {
      registerPromise = result.current.register(userData);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await act(async () => {
      await registerPromise;
    });
    expect(result.current.loading).toBe(false);
  })});
