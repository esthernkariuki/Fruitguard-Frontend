import { fetchRegister } from './fetchRegister';

describe('fetchRegister', () => {
  const userData = { firstName: '', lastName: '', email: '', password: '' };
  const mockResult = { token: '' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully registers and returns result', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true, json: jest.fn().mockResolvedValue(mockResult),
    });

    const result = await fetchRegister(userData);
    expect(global.fetch).toHaveBeenCalledWith('/api/register/', {
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

    await expect(fetchRegister(userData)).rejects.toThrow('Registration failed: Bad Request');
  });

  it('handles network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchRegister(userData)).rejects.toThrow('Failed to register: Network error');
  })});
