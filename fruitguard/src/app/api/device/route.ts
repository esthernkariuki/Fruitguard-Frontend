const baseUrl = process.env.BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/device/`);
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const {device_identifier, status, user_id} = body;

  if (!device_identifier ||!status || !user_id)  {
    return new Response(
      "Missing required values: device_identifier, status, user_id",
      {
        status: 400,
      }
    );
  }

  try {
    const response = await fetch(`${baseUrl}/device/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_identifier,
        status,
        user_id,
      }),
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}




