export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

export const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
};

export const deleteCookie = (name) => {
    document.cookie = name + '=; Max-Age=-99999999; path=/;';
};

export const getAuthHeaders = () => {
    const accessToken = getCookie('accessToken');
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
};

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, token = null) => {
    refreshQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    refreshQueue = [];
};

const apiCall = async (endpoint, method = 'GET', body = null, headers = {}, isRefreshAttempt = false) => {
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

        // Handle 401 Unauthorized - Token expired
        if (response.status === 401 && !isRefreshAttempt) {
            const refreshToken = getCookie('refreshToken');
            
            if (refreshToken) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        refreshQueue.push({
                            resolve: (token) => {
                                options.headers['Authorization'] = `Bearer ${token}`;
                                resolve(apiCall(endpoint, method, body, headers, true));
                            },
                            reject: (err) => {
                                resolve({ success: false, status: 401, message: 'Session expired' });
                            }
                        });
                    });
                }

                isRefreshing = true;
                try {
                    const refreshUrl = `${baseUrl}/auth/refresh-token?refreshToken=${refreshToken}`;
                    const refreshRes = await fetch(refreshUrl, { method: 'POST' });
                    
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshData;
                        
                        setCookie('accessToken', newAccessToken, 1);
                        setCookie('refreshToken', newRefreshToken, 7);
                        
                        isRefreshing = false;
                        processQueue(null, newAccessToken);
                        
                        // Retry the original request
                        options.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return apiCall(endpoint, method, body, headers, true);
                    } else {
                        isRefreshing = false;
                        processQueue(new Error('Refresh failed'));
                        deleteCookie('accessToken');
                        deleteCookie('refreshToken');
                        return { success: false, status: 401, message: 'Session expired' };
                    }
                } catch (refreshError) {
                    isRefreshing = false;
                    processQueue(refreshError);
                    return { success: false, status: 401, message: 'Session expired' };
                }
            }
        }

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

export const notebookAPI = {
    getNotebooks: () =>
        apiCall('/notebooks', 'GET', null, getAuthHeaders()),
    getNotebook: (id) =>
        apiCall(`/notebooks/${id}`, 'GET', null, getAuthHeaders()),
    createNotebook: (notebook) =>
        apiCall('/notebooks/create', 'POST', notebook, getAuthHeaders()),
    updateNotebook: (id, notebook) =>
        apiCall(`/notebooks/update/${id}`, 'PUT', notebook, getAuthHeaders()),
    deleteNotebook: (id) =>
        apiCall(`/notebooks/delete/${id}`, 'DELETE', null, getAuthHeaders()),
};

export const categoryAPI = {
    getAllCategories: () =>
        apiCall('/categories', 'GET', null, getAuthHeaders()),
    getCategory: (id) =>
        apiCall(`/categories/${id}`, 'GET', null, getAuthHeaders()),
    createCategory: (name) =>
        apiCall('/categories/create', 'POST', { name }, getAuthHeaders()),
    deleteCategory: (id) =>
        apiCall(`/categories/delete/${id}`, 'DELETE', null, getAuthHeaders()),
};

export const sectionAPI = {
    getSectionsByNotebook: (notebookId) =>
        apiCall(`/sections/notebook/${notebookId}`, 'GET', null, getAuthHeaders()),
    getSection: (id) =>
        apiCall(`/sections/${id}`, 'GET', null, getAuthHeaders()),
    createSection: (section) =>
        apiCall('/sections/create', 'POST', section, getAuthHeaders()),
    updateSection: (id, section) =>
        apiCall(`/sections/update/${id}`, 'PUT', section, getAuthHeaders()),
    deleteSection: (id) =>
        apiCall(`/sections/delete/${id}`, 'DELETE', null, getAuthHeaders()),
    reorderSections: (draggedId, targetId) =>
        apiCall('/sections/reorder', 'POST', { draggedId, targetId }, getAuthHeaders()),
    bulkUpdateSectionOrder: (requests) =>
        apiCall('/sections/bulk-reorder', 'POST', requests, getAuthHeaders()),
};

export default apiCall;
