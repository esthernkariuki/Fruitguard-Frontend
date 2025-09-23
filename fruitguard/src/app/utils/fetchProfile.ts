const baseUrl = 'api/profile';

export async function fetchProfile(token: string) {
  try {
    const response = await fetch(baseUrl!, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
        Accept: "application/json", },
    });
  if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = "Failed to fetch profile";

      if (contentType && contentType.includes("application/json")) {
        const errorJson = await response.json();
        errorMessage = errorJson.message || errorMessage;
      } else {
        const errorText = await response.text();
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();}
  catch (error) {
    throw error;
  }
}