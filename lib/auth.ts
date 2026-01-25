
const TOKEN_KEY = 'amicus_auth_token';

export interface UserInfo {
    userId: string;
    email: string;
}

export function storeToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

export function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(TOKEN_KEY);
    }
    return null;
}


export function clearToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
    }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    return !!getToken();
}

/**
 * Decode JWT token to get user info
 * Note: This is a simple base64 decode. In production, validate the signature.
 */
export function getUserFromToken(): UserInfo | null {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return {
            userId: decoded.userId,
            email: decoded.email,
        };
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}
