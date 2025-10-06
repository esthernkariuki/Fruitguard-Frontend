import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfilePage from './page';

jest.mock('../hooks/useFetchProfile');
jest.mock('../utils/updateProfile');
import useProfile from '../hooks/useFetchProfile';
import { updateProfile } from '../utils/updateProfile';

const mockedUseProfile = useProfile as jest.Mock;
const mockedUpdateProfile = updateProfile as jest.Mock;

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state when loading profile', () => {
    mockedUseProfile.mockReturnValue({ profile: null, loading: true, error: null });
    render(<ProfilePage />);
    expect(screen.getByText(/Loading profile…/i)).toBeInTheDocument();
  });

  test('shows error message when profile fetch error occurs', () => {
    mockedUseProfile.mockReturnValue({ profile: null, loading: false, error: 'Failed to load profile' });
    render(<ProfilePage />);
    expect(screen.getByText(/Failed to load profile/i)).toBeInTheDocument();
  });


    test('renders profile data correctly', async () => {
    mockedUseProfile.mockReturnValue({
      profile: {
        first_name: 'Esther',
        last_name: 'Nyambura',
        email: 'esthernyambura@example.com',
        profile_image: '/profile.jpg',
        user_type: 'Agrovet',
      },
      loading: false,
      error: null,
    });
    render(<ProfilePage />);
    await waitFor(() => {
      expect(screen.getByText('Esther Nyambura')).toBeInTheDocument();
      expect(screen.getByText('Agrovet')).toBeInTheDocument();
      expect(screen.getByText('esthernyambura@example.com')).toBeInTheDocument();
      const img = screen.getByAltText('Profile photo') as HTMLImageElement;
      expect(img.src).toContain('profile.jpg');
    });
  });


  test('renders correctly when some profile fields are null', () => {
    mockedUseProfile.mockReturnValue({
      profile: {
        first_name: null,
        last_name: null,
        email: null,
        profile_image: null,
        user_type: null,
      },
      loading: false,
      error: null,
    });
    render(<ProfilePage />);
    expect(screen.queryByText(/null/i)).not.toBeInTheDocument();

  });

  test('updates form input values on change', async () => {
    mockedUseProfile.mockReturnValue({
      profile: {
        first_name: 'Esther',
        last_name: 'Nyambura',
        email: 'esthernyambura@example.com',
        profile_image: '',
        user_type: 'Agrovet',
      },
      loading: false,
      error: null,
    });
    render(<ProfilePage />);
    const user = userEvent.setup();

    const firstNameInput = screen.getByLabelText(/First name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Esther');
    await waitFor(() => expect(firstNameInput).toHaveValue('Esther'));

    const lastNameInput = screen.getByLabelText(/Last name/i);
    await user.clear(lastNameInput);
    await user.type(lastNameInput, 'Nyambura');
    await waitFor(() => expect(lastNameInput).toHaveValue('Nyambura'));

    const emailInput = screen.getByLabelText(/Email/i);
    await user.clear(emailInput);
    await user.type(emailInput, 'esthernyambura@example.com');
    await waitFor(() => expect(emailInput).toHaveValue('esthernyambura@example.com'));
  });

  test('shows updating message and calls updateProfile on form submit', async () => {
    mockedUseProfile.mockReturnValue({
      profile: { first_name: 'Esther', last_name: 'Nyambura', email: 'esthernyambura@example.com', profile_image: '', user_type: 'Agrovet', },
      loading: false, error: null,
    });
    mockedUpdateProfile.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<ProfilePage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Update/i }));
    expect(screen.getByText(/Updating profile…/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText(/Updating profile…/i)).not.toBeInTheDocument()
    );
    expect(mockedUpdateProfile).toHaveBeenCalledTimes(1);
  });

  test('shows update error message on submission failure', async () => {
    mockedUseProfile.mockReturnValue({
      profile: { first_name: 'Esther', last_name: 'Nyambura', email: 'esthernyambura@example.com', profile_image: '', user_type: 'Agrovet', },
      loading: false, error: null,
    });
    mockedUpdateProfile.mockRejectedValue(new Error('Update failed'));
    render(<ProfilePage />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Update/i }));
    await waitFor(() => {
      expect(screen.getByText(/Update failed/i)).toBeInTheDocument();
    });
  });
});
