import { fetchDevices, addDevice } from './fetchDevice';

const baseUrl = '/api/device/';

describe('Device API', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchDevices', () => {
    it('fetches devices list successfully', async () => {
      const mockData = [
        { device_identifier: 'ESP320000890', status: 'active', user_id: 1 },
        { device_identifier: 'ESP320000876', status: 'inactive', user_id: 2 },
      ];
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockData),
      });

      const result = await fetchDevices();

      expect(fetch).toHaveBeenCalledWith(baseUrl);
      expect(result).toEqual(mockData);
    });

    it('returns empty array if backend returns empty array', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce([]),
      });

      const result = await fetchDevices();

      expect(fetch).toHaveBeenCalledWith(baseUrl);
      expect(result).toEqual([]);
    });
  });

  describe('addDevice', () => {
    const mockNewDevice = {
      device_identifier: 'ESP32000234',
      status: 'active',
      user_id: 3,
    };

    it('adds a device successfully', async () => {
      const mockResponse = { id: 1, ...mockNewDevice };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await addDevice(mockNewDevice);

      expect(fetch).toHaveBeenCalledWith(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewDevice),
      });
      expect(result).toEqual(mockResponse);
    });

    it('throws an error when response is not ok', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      await expect(addDevice(mockNewDevice)).rejects.toThrow(
        'Failed to add device: Something went wrong: Bad Request'
      );
      expect(fetch).toHaveBeenCalledWith(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewDevice),
      });
    });

    it('throws an error on network failure', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

      await expect(addDevice(mockNewDevice)).rejects.toThrow(
        'Failed to add device: Network Error'
      );
      expect(fetch).toHaveBeenCalledWith(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockNewDevice),
      });
    });
  });
});