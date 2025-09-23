import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisteredFarmers from './page';

jest.mock('../hooks/useFetchFarmers');

import { useFetchFarmers } from '../hooks/useFetchFarmers';
const mockedUseFetchFarmers = useFetchFarmers as jest.Mock;

describe('RegisteredFarmers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state', () => {
        mockedUseFetchFarmers.mockReturnValue({ farmers: [], loading: true, error: null });
        render(<RegisteredFarmers />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('renders error state', () => {
        mockedUseFetchFarmers.mockReturnValue({ farmers: [], loading: false, error: 'Error fetching data' });
        render(<RegisteredFarmers />);
        expect(screen.getByText(/Error fetching data/i)).toBeInTheDocument();
    });

    it('renders list of farmers', () => {
        mockedUseFetchFarmers.mockReturnValue({
            farmers: [
                { id: 1, first_name: 'Esther', last_name: 'Nyambura', number_of_traps: 2, location: 'mbooni', phone_number: '07234567890' },
                { id: 2, first_name: 'Jane', last_name: 'Wanyoike', number_of_traps: 5, location: 'wote', phone_number: '0787654321' },
            ],
            loading: false,
            error: null,
        });
        render(<RegisteredFarmers />);
        expect(screen.getByText(/Esther Nyambura/i)).toBeInTheDocument();
        expect(screen.getByText(/Jane Wanyoike/i)).toBeInTheDocument();
    });

    it('renders correctly with null or missing fields from backend', () => {
        mockedUseFetchFarmers.mockReturnValue({
            farmers: [
                { id: 1, first_name: null, last_name: null, number_of_traps: null, location: null, phone_number: null },
                { id: 2, first_name: 'Jane', last_name: null, number_of_traps: 5, location: 'wote', phone_number: '' },
            ],
            loading: false,
            error: null,
        });
        render(<RegisteredFarmers />);

        expect(screen.queryByText(/null/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Jane/i)).toBeInTheDocument();

    });

    it('filters farmers based on search input', async () => {
        mockedUseFetchFarmers.mockReturnValue({
            farmers: [
                { id: 1, first_name: 'Esther', last_name: 'Nyambura', number_of_traps: 2, location: 'mbooni', phone_number: '07234567890' },
                { id: 2, first_name: 'Jane', last_name: 'Wanyoike', number_of_traps: 5, location: 'wote', phone_number: '0787654321' },
            ],
            loading: false,
            error: null,
        });
        render(<RegisteredFarmers />);
        fireEvent.change(screen.getByPlaceholderText(/Search/i), { target: { value: 'Jane' } });
        await waitFor(() => {
            expect(screen.getByText(/Jane Wanyoike/i)).toBeInTheDocument();
            expect(screen.queryByText(/Esther Nyambura/i)).toBeNull();
        });
    });

    it('shows no farmers found if filter matches none', async () => {
        mockedUseFetchFarmers.mockReturnValue({
            farmers: [
                { id: 1, first_name: 'Esther', last_name: 'Nyambura', number_of_traps: 2, location: 'mbooni', phone_number: '07234567890' },
            ],
            loading: false,
            error: null,
        });
        render(<RegisteredFarmers />);
        fireEvent.change(screen.getByPlaceholderText(/Search/i), { target: { value: 'NoMatch' } });
        await waitFor(() => {
            expect(screen.getByText(/No farmers found/i)).toBeInTheDocument();
        });
    });
});
