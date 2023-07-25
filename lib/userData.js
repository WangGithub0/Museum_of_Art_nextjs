import { getToken } from '../lib/authenticate';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function performRequest(url, method, data = null) {
  try {
    const token = await getToken();
    const headers = {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json',
    };

    const options = {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    if (response.ok) {
      return responseData;
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error occurred during API request:', error);
    return [];
  }
}

export async function addToFavourites(id) {
  const url = `${apiUrl}/favourites/${id}`;
  return await performRequest(url, 'PUT');
}

export async function removeFromFavourites(id) {
  const url = `${apiUrl}/favourites/${id}`;
  return await performRequest(url, 'DELETE');
}

export async function getFavourites() {
  const url = `${apiUrl}/favourites`;
  return await performRequest(url, 'GET');
}

export async function addToHistory(id) {
  const url = `${apiUrl}/history/${id}`;
  return await performRequest(url, 'PUT');
}

export async function removeFromHistory(id) {
  const url = `${apiUrl}/history/${id}`;
  return await performRequest(url, 'DELETE');
}

export async function getHistory() {
  const url = `${apiUrl}/history`;
  return await performRequest(url, 'GET');
}
