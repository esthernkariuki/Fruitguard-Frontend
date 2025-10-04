
const baseUrl = process.env.BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${baseUrl}/users`);
    const users = await response.json();
    const agrovets = users.filter((user: { user_type: string }) => user.user_type === "agrovet");

    return new Response(JSON.stringify(agrovets), { status: 200 });
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}
