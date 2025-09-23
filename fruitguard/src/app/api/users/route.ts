const baseUrl = process.env.BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/users`);
    const result = await response.json();
    return new Response(JSON.stringify(result), {});
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    if (!baseUrl) {
      throw new Error("BASE_URL is not defined ");
    }

    let body;
    try {
      body = await request.json(); 
    } catch (parseError) {
      return new Response("Invalid JSON payload", { status: 400 });
    }

    const response = await fetch(`${baseUrl}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create user: HTTP ${response.status} - ${errorText}`);
    }

    const newUser = await response.json();
    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { "Content-Type": "application/json" },
      statusText: "User created successfully!",
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}




