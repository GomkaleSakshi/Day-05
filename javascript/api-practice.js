const API_BASE_URL = "https://jsonplaceholder.typicode.com/users";

// HTTP is the request/response protocol used by web APIs. JSON is a common
// text format for sending structured data. REST APIs expose resources at URLs
// and use methods such as GET, POST, PUT, and DELETE to act on them.
async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function practiceRestRequests() {
  try {
    // GET reads a collection of users.
    const users = await requestJson(API_BASE_URL);
    console.log("GET users:", users.slice(0, 2));

    // POST creates a demo user. The service returns a simulated created record.
    const newUser = await requestJson(API_BASE_URL, {
      method: "POST",
      body: JSON.stringify({ name: "Taylor Morgan", email: "taylor@example.com" })
    });
    console.log("POST created user:", newUser);

    // PUT replaces a demo user's data.
    const updatedUser = await requestJson(`${API_BASE_URL}/1`, {
      method: "PUT",
      body: JSON.stringify({ id: 1, name: "Updated User", email: "updated@example.com" })
    });
    console.log("PUT updated user:", updatedUser);

    // DELETE removes a demo user's data in the simulated response.
    const deleteResult = await requestJson(`${API_BASE_URL}/1`, { method: "DELETE" });
    console.log("DELETE response:", deleteResult);
  } catch (error) {
    console.error("API practice failed:", error.message);
  }
}

practiceRestRequests();
