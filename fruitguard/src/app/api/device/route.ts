const baseUrl = process.env.BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/device/`);
    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
    const body = await request.json();
    const response = await fetch(`${baseUrl}/device/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to add device. ${
          response.status
        } - ${await response.json()}`
      );
    }

  try {
    if (!baseUrl) {
      throw new Error(
        "BASE_URL is not defined."
      );
    }

    

    const newDevice = await response.json();
    return new Response(JSON.stringify(newDevice), {
      status: 201,
      headers: { "Content-Type": "application/json" },
      statusText: "Device added successfully",
    });
  } catch (error) {
    return new Response((error as Error).message, {
      status: 500,
    });
  }
}
