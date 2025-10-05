const baseUrl = process.env.BASE_URL;


export async function GET(request: Request) {
 try {
   const authHeader = request.headers.get("authorization") || "";
   const response = await fetch(`${baseUrl}/profile/`, {
     headers: { Authorization: authHeader },});


   if (!response.ok) {
    const errorText = await response.text();
       return new Response(`Failed to fetch profile: ${response.status} - ${errorText}`, {
       status: response.status, });}
   const result = await response.json();
   return new Response(JSON.stringify(result), {status: 200,
     headers: {
       "Content-Type": "application/json" }, });}
    
 catch (error) {
   return new Response((error as Error).message, { status: 500, });
}
}

  