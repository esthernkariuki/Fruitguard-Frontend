const baseUrl = 'api/updateprofile';

export async function updateProfile(token: string, data: FormData) {
  try {
    const res = await fetch(baseUrl, {
      method: "PUT",
      headers: {
        Authorization: `Token ${token}`,
      },
      body: data,
    });

    if (!res.ok) {
      throw new Error(`Failed to update profile: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    throw new Error("Something went wrong while updating the profile: " + (error as Error).message);
  }
}
