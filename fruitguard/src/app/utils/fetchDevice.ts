const baseUrl = "/api/device/";

export async function fetchDevices() {
  try{
    const response = await fetch (baseUrl);
    if(!response.ok){
      throw new Error ("Something went wrong:"+ response.statusText)
    }
    const result = await response.json()
    return result;

  }catch(error){
    throw new Error("Failed to fetch device:"+ (error as Error).message)
  }
}