const baseUrl = 'api/updateprofile';

export async function updateProfile(token: string, data: FormData) {
  try {
  const res = await fetch(baseUrl, {
    method: "PUT",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: data,
  });

  if (!res.ok) {
    let errorMsg = "Failed to update profile";
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorJson = await res.json();
      errorMsg = errorJson.message ?? errorMsg;
    } else {
      const errorText = await res.text();
      errorMsg = errorText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  return res.json();

} catch (error) {
  console.error("Fetch error:", error);
  throw error;
}
}