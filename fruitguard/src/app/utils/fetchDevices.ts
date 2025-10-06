const baseUrl = '/api/devices';
export async function fetchDevices() {
 try {
   const response = await fetch(baseUrl);
   if (!response.ok) {
     throw new Error("Something went wrong: " + response.statusText);
   }
   return await response.json();
 } catch (error) {
   throw new Error((error as Error).message);
 }
}



