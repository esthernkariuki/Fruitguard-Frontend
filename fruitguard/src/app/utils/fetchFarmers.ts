const baseUrl = 'api/user';

export async function fetchFarmers() {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error("couldn't load the farmers list:" + response.statusText);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Something went wrong while loading the farmers list: " + (error as Error).message);
  }
}