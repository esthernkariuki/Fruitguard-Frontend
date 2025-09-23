import { fetchProfile } from "./fetchProfile";

describe('fetchProfile', () => {
  const token = 'dummy-token';

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns profile JSON on successful fetch', async () => {
    const mockProfile = { name: 'John wambui', email: 'john@wambui.com' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProfile,
      headers: { get: () => 'application/json' },
    });
    const result = await fetchProfile(token);
    expect(result).toEqual(mockProfile);
    expect(global.fetch).toHaveBeenCalledWith('api/profile', {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
        Accept: 'application/json',
      },
    });
  });

  it('throws error with JSON message if not ok and content-type is application/json', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Unauthorized access' }),
    });
    await expect(fetchProfile(token)).rejects.toThrow('Unauthorized access');
  });

  it('throws error with text message if not ok and content-type not application/json', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      headers: { get: () => 'text/plain' },
      text: async () => 'Not found',
    });
    await expect(fetchProfile(token)).rejects.toThrow('Not found');
  });

  it('throws default error if no message on failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      headers: { get: () => null },
      text: async () => '',
    });
    await expect(fetchProfile(token)).rejects.toThrow('Failed to fetch profile');
  });

  it('returns null when backend returns null', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => null,
      headers: { get: () => 'application/json' },
    });
    const result = await fetchProfile(token);
    expect(result).toBeNull();
  });
});
