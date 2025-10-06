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

export async function addDevice(data: {device_identifier: string; status: string; user_id:number}) {
 try {
   const response = await fetch(baseUrl, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(data),
   });
   if (!response.ok) {
     throw new Error('Something went wrong: ' + response.statusText);
   }
   const result = await response.json();
   return result;
 } catch (error) {
   throw new Error('Failed to add device: ' + (error as Error).message);
 }
}