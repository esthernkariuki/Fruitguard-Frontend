import { updateProfile } from "./updateProfile";

describe('updateProfile', () => {
    const token = 'dummy-token';
    const formData = new FormData();

    beforeEach(() => {
        global.fetch = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('returns JSON on successful update', async () => {
        const mockResponse = { success: true };
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
            headers: { get: () => 'application/json' },
        });

        const result = await updateProfile(token, formData);
        expect(result).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith('api/updateprofile', {
            method: 'PUT',
            headers: { Authorization: `Token ${token}` },
            body: formData,
        });
    });

    it('throws error with JSON message if response not ok with application/json content-type', async () => {
        const errorMsg = 'Invalid profile data';
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            headers: { get: () => 'application/json' },
            json: async () => ({ message: errorMsg }),
        });

        await expect(updateProfile(token, formData)).rejects.toThrow(errorMsg);
    });

    it('throws error with text response if response not ok and content-type not application/json', async () => {
        const errorText = 'Bad request';
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            headers: { get: () => 'text/plain' },
            text: async () => errorText,
        });

        await expect(updateProfile(token, formData)).rejects.toThrow(errorText);
    });

    it('throws default error if response not ok and no message provided', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            headers: { get: () => null },
            text: async () => '',
        });

        await expect(updateProfile(token, formData)).rejects.toThrow('Failed to update profile');
    });

    it('returns null when backend returns null JSON', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => null,
            headers: { get: () => 'application/json' },
        });

        const result = await updateProfile(token, formData);
        expect(result).toBeNull();
    });
});
