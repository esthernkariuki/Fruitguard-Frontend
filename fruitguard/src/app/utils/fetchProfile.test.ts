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


  it('throws error with statusText on not ok response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText:'Unauthorized access',
    });

    await expect(fetchProfile('invalidToken')).rejects.toThrow("Something went wrong while fetching the profile: Failed to fetch profile: Unauthorized access");
  });

  it('throws error on fetch failure', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

    await expect(fetchProfile('Token')).rejects.toThrow('Something went wrong while fetching the profile: Network failure');
  });
});

