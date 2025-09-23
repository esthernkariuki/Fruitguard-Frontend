const baseUrl = process.env.BASE_URL;

export async function GET(request: Request) {
  try {
    const response = await fetch(`${baseUrl}/profile/`, {
      headers: request.headers,
    });

    if (!response.ok) { 
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 
        "Content-Type": "application/json" 
      }, 
    });
  }
  catch (error) {
    return new Response((error as Error).message, {
      status: 500, 
    });
  }
}