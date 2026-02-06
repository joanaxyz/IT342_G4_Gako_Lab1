export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

export const getAuthHeaders = () => {
    const accessToken = getCookie('accessToken');
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
};

const apiCall = async (endpoint, method = 'GET', body = null, headers = {}) => {
    const baseUrl = import.meta.env.VITE_BRAINBOX_API_URL || 'http://localhost:8080/api';
    const url = `${baseUrl}${endpoint}`;

    const accessToken = getCookie('accessToken');

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
            ...headers
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);

        let data;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (response.ok) {
            return {
                success: true,
                status: response.status,
                data: typeof data === 'object' ? data : null,
                message: typeof data === 'string' ? data : (data?.message || null)
            };
        } else {
            return {
                success: false,
                status: response.status,
                data: null,
                message: typeof data === 'string' ? data : (data?.message || 'Request failed')
            };
        }
    } catch (error) {
        console.error(`API call to ${endpoint} failed:`, error);
        return {
            success: false,
            status: 500,
            data: null,
            message: error.message || 'Network error'
        };
    }
};

export const authAPI = {
    register: (username, email, password) =>
        apiCall('/auth/register', 'POST', { username, email, password }),

    login: (username, password) =>
        apiCall('/auth/login', 'POST', { username, password }),

    forgotPassword: (email) =>
        apiCall('/auth/forgot-password', 'POST', { email }),

    verifyCode: (email, code) =>
        apiCall('/auth/verify-code', 'POST', { email, code }),

    resetPassword: (token, newPassword) =>
        apiCall('/auth/reset-password', 'POST', { token, newPassword }),
    logout: (refreshToken) =>
        apiCall('/auth/logout', 'POST', { refreshToken }),
    refreshToken: (refreshToken) =>
        apiCall(`/auth/refresh-token?refreshToken=${refreshToken}`, 'POST'),
    getMe: () =>
        apiCall('/user/me', 'GET', null, getAuthHeaders()),
};


export default apiCall;
