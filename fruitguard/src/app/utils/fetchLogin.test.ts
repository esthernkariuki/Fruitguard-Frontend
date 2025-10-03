import { fetchLogin } from './fetchLogin';

describe('fetchLogin', () => {
  const userData = { email: '', password: '' };
  const mockResult = { token: '' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully logs in and returns result', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true, json: jest.fn().mockResolvedValue(mockResult),
    });

    const result = await fetchLogin(userData);
    expect(global.fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    expect(result).toEqual(mockResult);
  });

  it('handles HTTP error response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false, statusText: 'Bad Request',
    });

    await expect(fetchLogin(userData)).rejects.toThrow('Failed to login: Loggin failed: Bad Request');
  });

  it('handles network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchLogin(userData)).rejects.toThrow('Failed to login: Network error');
  })});
