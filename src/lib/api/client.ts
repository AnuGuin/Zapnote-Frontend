export const apiClient = {
    async post<T>(url: string, data: unknown): Promise<T> {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        return response.json();
    },

    async get<T>(url: string): Promise<T> {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        return response.json();
    }
};
