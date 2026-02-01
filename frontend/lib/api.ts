const BASE_URL = "http://localhost:8080";

export async function infer(text: string) {
  const res = await fetch(`${BASE_URL}/infer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
}
