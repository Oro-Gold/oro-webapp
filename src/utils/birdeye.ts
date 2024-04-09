export async function makeApiRequest(path, headers) {
  try {
    const FULL_PATH = `https://public-api.birdeye.so/${path}`;

    const response = await fetch(FULL_PATH, {
      headers,
    });
    return response.json();
  } catch (error) {
    throw new Error(`Birdeye request error: ${error}`);
  }
}
