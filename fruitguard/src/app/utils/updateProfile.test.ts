import { updateProfile } from "./updateProfile";

const baseUrl = 'api/updateprofile';

describe('updateProfile', () => {
    beforeEach(() => { global.fetch = jest.fn(); });

    afterEach(() => { jest.resetAllMocks(); });

    const token = '123456789est';
    const mockFormData = new FormData();

    it('sends PUT request and returns JSON response on success', async () => {
        const mockResponseData = { success: true };
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, 
            json: jest.fn().mockResolvedValueOnce(mockResponseData), headers: new Map(), 
        });

        const result = await updateProfile(token, mockFormData);

        expect(fetch).toHaveBeenCalledWith(baseUrl, {
            method: 'PUT',
            headers: { Authorization: `Token ${token}` },
            body: mockFormData,
        });
        expect(result).toEqual(mockResponseData);
    });

    it('handles null JSON response gracefully', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({ok: true,
            json: jest.fn().mockResolvedValueOnce(null),headers: new Map(), 
    });

        const result = await updateProfile(token, mockFormData);
        expect(result).toBeNull();
    });

    it('throws error with JSON error message from response', async () => {
        const errorJson = { message: 'Invalid token' };
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            headers: {
                get: (header: string) => (header === 'content-type' ? 'application/json' : null),
            },
            json: jest.fn().mockResolvedValueOnce(errorJson),
        });

        await expect(updateProfile(token, mockFormData)).rejects.toThrow('Invalid token');
    });

    it('throws error with plain text error message from response', async () => {
        const errorText = 'Unauthorized access';
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            headers: {
                get: (header: string) => (header === 'content-type' ? 'text/plain' : null),
            },
            text: jest.fn().mockResolvedValueOnce(errorText),
        });

        await expect(updateProfile(token, mockFormData)).rejects.toThrow('Unauthorized access');
    });

    it('throws default error message if no error message provided', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            headers: { get: () => null },
            text: jest.fn().mockResolvedValueOnce(''),
        });

        await expect(updateProfile(token, mockFormData)).rejects.toThrow('Failed to update profile');
    });

    it('throws error from caught Error instance (network or other failure)', async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

        await expect(updateProfile(token, mockFormData)).rejects.toThrow('Network failure');
    });

    it('throws error if rejection is non-Error', async () => {
        (fetch as jest.Mock).mockImplementationOnce(() => Promise.reject('some error'));

        await expect(updateProfile(token, mockFormData)).rejects.toThrow('Updating profile failed');
    });
});
