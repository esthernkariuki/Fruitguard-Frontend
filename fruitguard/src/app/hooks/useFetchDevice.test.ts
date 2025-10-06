import { renderHook, waitFor } from '@testing-library/react';
import { useFetchDevices } from './useFetchDevice';
import { fetchDevices } from '../utils/fetchDevice';

jest.mock('../utils/fetchDevice');

describe('useFetchDevices', () => {
 test('should return an initial loading state', () => {
   (fetchDevices as jest.Mock).mockResolvedValue([]);

   const { result } = renderHook(() => useFetchDevices());

   expect(result.current.loading).toBe(true);
   expect(result.current.devices).toEqual([]);
   expect(result.current.error).toBe(null);
 });

 test('should fetch and return data successfully', async () => {
   const mockDevices = [
     { device_id: 1, device_identifier: 'ESP32000034', status: 'active', created_at: 'now', user_id: 1 },
     { device_id: 2, device_identifier: 'ESP32000059', status: 'inactive', created_at: 'now', user_id: 2 },
   ];
   (fetchDevices as jest.Mock).mockResolvedValue(mockDevices);

   const { result } = renderHook(() => useFetchDevices());
   await waitFor(() => expect(result.current.loading).toBe(false));

   expect(result.current.devices).toEqual(mockDevices);
   expect(result.current.error).toBe(null);
 });

 test('should handle fetching errors', async () => {
   const mockError = new Error('Network error');
   (fetchDevices as jest.Mock).mockRejectedValue(mockError);

   const { result } = renderHook(() => useFetchDevices());

   await waitFor(() => expect(result.current.loading).toBe(false));

   expect(result.current.devices).toEqual([]);
   expect(result.current.error).toBe(mockError.message);
 });

 test('should allow data to be refetched', async () => {
   const initialDevices = [{ device_id: 1, device_identifier: 'test-device-1', status: 'active', created_at: 'now', user_id: 1 }];
   const refetchedDevices = [{ device_id: 2, device_identifier: 'test-device-2', status: 'inactive', created_at: 'now', user_id: 2 }];

   (fetchDevices as jest.Mock)
     .mockResolvedValueOnce(initialDevices)
     .mockResolvedValueOnce(refetchedDevices);

   const { result } = renderHook(() => useFetchDevices());

   await waitFor(() => expect(result.current.devices).toEqual(initialDevices));

   await waitFor(() => result.current.refetch());

   await waitFor(() => expect(result.current.devices).toEqual(refetchedDevices));

   expect(result.current.loading).toBe(false);
 });
});


