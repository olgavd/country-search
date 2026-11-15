import { HttpError } from './HttpError.js';
const API_URL = 'https://countries.dev/name';
export async function searchCountries(query, signal) {
    const url = `${API_URL}/${encodeURIComponent(query)}`;
    const response = await fetch(url, { signal });
    if (response.status === 404) {
        return [];
    }
    if (!response.ok) {
        throw new HttpError(`Request failed with status ${response.status}`, response.status);
    }
    return (await response.json());
}
//# sourceMappingURL=searchCountries.js.map