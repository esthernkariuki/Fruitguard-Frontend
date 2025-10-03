import { fetchProfile } from "./fetchProfile";
const baseUrl = 'api/profile';

describe('fetchProfile', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches profile successfully', async () => {
    const mockData = { username: 'joanita', email: 'joanita@awinjo.com' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockData),
      headers: new Map(),
    });

    const token = 'Token123';
    const data = await fetchProfile(token);

    expect(fetch).toHaveBeenCalledWith(baseUrl, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json',
      },
    });

    expect(data).toEqual(mockData);
  });

  it('throws error with JSON error message from response', async () => {
    const errorJson = { message: 'Unauthorized access' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      headers: {
        get: (header: string) => header === 'content-type' ? 'application/json' : null,
      },
      json: jest.fn().mockResolvedValueOnce(errorJson),
    });

    await expect(fetchProfile('invalidToken')).rejects.toThrow('Unauthorized access');
  });

  it('throws error with plain text error message from response', async () => {
    const errorText = 'Not found';
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      headers: {
        get: (header: string) => header === 'content-type' ? 'text/plain' : null,
      },
      text: jest.fn().mockResolvedValueOnce(errorText),
    });

    await expect(fetchProfile('Token')).rejects.toThrow('Not found');
  });

  it('throws default error message if no error message present', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      headers: {
        get: () => null,
      },
      text: jest.fn().mockResolvedValueOnce(''),
    });

    await expect(fetchProfile('Token')).rejects.toThrow('Failed to fetch profile');
  });

  it('throws error from caught Error instance', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

    await expect(fetchProfile('Token')).rejects.toThrow('Network failure');
  });

  it('throws  error for non-Error rejection', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() => Promise.reject('some error'));

    await expect(fetchProfile('Token')).rejects.toThrow('Profile fetch failed');
  });
});

