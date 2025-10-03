const baseUrl = process.env.BASE_URL;


export async function PUT(request: Request) {
 try {
   const authHeader = request.headers.get("authorization") || "";
   const body = await request.formData();
   const res = await fetch(`${baseUrl}/profile/`, {
     method: "PUT",
     headers: {Authorization: authHeader,},body, });


   if (!res.ok) {
     const text = await res.text();
     throw new Error(`Failed update: ${res.status} - ${text}`); }


   const data = await res.json();
   return new Response(JSON.stringify(data), {
     status: 200,
     headers: { "Content-Type": "application/json" },});}
 catch (error) {
   return new Response((error as Error).message, { status: 500 });
 }
}
