const baseUrl = "/api/login";
export async function fetchLogin(email: string, password: string) {
  try{
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Login failed: " + errorText);
  }
  const result = await response.json();
  if (result.token) {
    localStorage.setItem("token", result.token);
  }
  if (result.user_type) {
    localStorage.setItem("user_type", result.user_type);
  }
  return result;
}catch(error){
  throw new Error("Failed to login: " + (error as Error).message);
}};







