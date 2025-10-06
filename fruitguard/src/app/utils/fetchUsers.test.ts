import { fetchUsers, addFarmers } from './fetchUsers'; 

const baseUrl = '/api/farmers';

describe('Users API', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchUsers', () => {
    it('fetches users list successfully', async () => {
      const mockData = [
        { id: 1, first_name: 'Joy', last_name: 'Mwandia', phone_number: '1234567890', location: 'Nairobi', number_of_traps: '5', user_type: 'farmer' },
        { id: 2, first_name: 'John', last_name: 'Doe', phone_number: '0987654321', location: 'Mombasa', number_of_traps: '3', user_type: 'farmer' },
      ];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await fetchUsers();

      expect(fetch).toHaveBeenCalledWith(baseUrl);
      expect(result).toEqual(mockData);
    });

    it('returns empty array if backend returns empty array', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce([]),
      });

      const result = await fetchUsers();

      expect(fetch).toHaveBeenCalledWith(baseUrl);
      expect(result).toEqual([]);
    });

    it('throws an error when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Server error',
      });

      await expect(fetchUsers()).rejects.toThrow(
        'Failed to fetch users: Something went wrong: Server error'
      );
      expect(fetch).toHaveBeenCalledWith(baseUrl);
    });

    it('throws an error on network failure', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

      await expect(fetchUsers()).rejects.toThrow(
        'Failed to fetch users: Network Error'
      );
      expect(fetch).toHaveBeenCalledWith(baseUrl);
    });
  });

  describe('addFarmers', () => {
    const mockNewFarmer = {
      first_name: 'Jane',
      last_name: 'Smith',
      phone_number: '1122334455',
      location: 'Kisumu',
      number_of_traps: '4',
      user_type: 'farmer',
    };

    it('adds a farmer successfully', async () => {
      const mockResponse = { id: 3, ...mockNewFarmer };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await addFarmers(mockNewFarmer);

      expect(fetch).toHaveBeenCalledWith(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewFarmer),
      });
      expect(result).toEqual(mockResponse);
    });

    it('throws an error when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(addFarmers(mockNewFarmer)).rejects.toThrow(
        'Failed to add farmer: Something went wrong: Bad Request'
      );
      expect(fetch).toHaveBeenCalledWith(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewFarmer),
      });
    });

    it('throws an error on network failure', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

      await expect(addFarmers(mockNewFarmer)).rejects.toThrow(
        'Failed to add farmer: Network Error'
      );
      expect(fetch).toHaveBeenCalledWith(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewFarmer),
      });
    });
  });
});