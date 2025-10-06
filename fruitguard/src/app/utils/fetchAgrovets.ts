const baseUrl = '/api/users';
export async function fetchAgrovets() {
 try {
   const response = await fetch(baseUrl);
   if (!response.ok) {
     throw new Error("Something went wrong: " + response.statusText);
   }
   return await response.json();
 } catch (error) {
   throw new Error("Failed to fetch agrovets: " + (error as Error).message);
 }
}
