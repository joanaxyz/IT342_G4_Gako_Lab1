export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

export const getAuthHeaders = () => {
    const accessToken = getCookie('accessToken');
    return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
};

const getBaseUrl = () =>
    import.meta.env.DEV
        ? '/api'
        : (import.meta.env.VITE_API_URL || 'http://localhost:8080/api');

const apiCall = async (endpoint, method = 'GET', body = null, headers = {}) => {
    const baseUrl = getBaseUrl();
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
        if (response.status === 204) {
            data = null;
        } else {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
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

// Chat API – matches backend /api/chat
export const chatAPI = {
    processQuery: (chatId, question, categoryId, test, authHeaders = {}) =>
        apiCall('/chat/process-query', 'POST', {
            id: chatId || null,
            question,
            categoryId: categoryId ?? null,
            test: !!test,
        }, { ...getAuthHeaders(), ...authHeaders }),

    findChat: (chatId, authHeaders = {}) =>
        apiCall(`/chat/get/${chatId}`, 'GET', null, { ...getAuthHeaders(), ...authHeaders }),

    loadChatSummary: (authHeaders = {}) =>
        apiCall('/chat/getAllSummaryByUser', 'GET', null, { ...getAuthHeaders(), ...authHeaders }),

    loadChats: (authHeaders = {}) =>
        apiCall('/chat/getAllByUser', 'GET', null, { ...getAuthHeaders(), ...authHeaders }),

    deleteChat: (chatId, authHeaders = {}) =>
        apiCall(`/chat/delete/${chatId}`, 'DELETE', null, { ...getAuthHeaders(), ...authHeaders }),
};

// Category API – matches backend /api/category
export const categoryAPI = {
    loadCategories: (authHeaders = {}) =>
        apiCall('/category/getAll', 'GET', null, { ...getAuthHeaders(), ...authHeaders }),

    getById: (id, authHeaders = {}) =>
        apiCall(`/category/${id}`, 'GET', null, { ...getAuthHeaders(), ...authHeaders }),

    add: (name, authHeaders = {}) =>
        apiCall('/category/add', 'POST', { name }, { ...getAuthHeaders(), ...authHeaders }),

    update: (id, name, content, presets, authHeaders = {}) =>
        apiCall('/category/update', 'POST', { id, name, content, presets }, { ...getAuthHeaders(), ...authHeaders }),

    deleteCategory: (id, authHeaders = {}) =>
        apiCall(`/category/delete/${id}`, 'DELETE', null, { ...getAuthHeaders(), ...authHeaders }),

    getHistory: (id, authHeaders = {}) =>
        apiCall(`/category/${id}/history`, 'GET', null, { ...getAuthHeaders(), ...authHeaders }),

    revert: (categoryId, historyId, authHeaders = {}) =>
        apiCall('/category/revert', 'POST', { categoryId, historyId }, { ...getAuthHeaders(), ...authHeaders }),
};

export const adminAPI = {
    getAllUsers: (authHeaders = {}) =>
        apiCall('/admin/users', 'GET', null, { ...getAuthHeaders(), ...authHeaders }),

    createAdmin: (body, authHeaders = {}) =>
        apiCall('/admin/users', 'POST', body, { ...getAuthHeaders(), ...authHeaders }),

    banUser: (userId, authHeaders = {}) =>
        apiCall(`/admin/users/${userId}/ban`, 'PATCH', null, { ...getAuthHeaders(), ...authHeaders }),

    unbanUser: (userId, authHeaders = {}) =>
        apiCall(`/admin/users/${userId}/unban`, 'PATCH', null, { ...getAuthHeaders(), ...authHeaders }),

    deleteUser: (userId, authHeaders = {}) =>
        apiCall(`/admin/users/${userId}`, 'DELETE', null, { ...getAuthHeaders(), ...authHeaders }),

    getAllCategories: (authHeaders = {}) =>
        apiCall('/category/getAll', 'GET', null, { ...getAuthHeaders(), ...authHeaders }),

    getAllChats: (authHeaders = {}) =>
        apiCall('/chat/getAll', 'GET', null, { ...getAuthHeaders(), ...authHeaders }),

    getAllSessions: (authHeaders = {}) =>
        apiCall('/admin/sessions', 'GET', null, { ...getAuthHeaders(), ...authHeaders }),

    getCategoryHistory: (categoryId, authHeaders = {}) =>
        apiCall(`/category/${categoryId}/history`, 'GET', null, { ...getAuthHeaders(), ...authHeaders }),

    addCategory: (name, authHeaders = {}) =>
        apiCall('/category/add', 'POST', { name }, { ...getAuthHeaders(), ...authHeaders }),

    updateCategory: (categoryId, name, content, presets, authHeaders = {}) =>
        apiCall('/category/update', 'POST', { id: categoryId, name, content, presets }, { ...getAuthHeaders(), ...authHeaders }),

    deleteCategory: (categoryId, authHeaders = {}) =>
        apiCall(`/category/delete/${categoryId}`, 'DELETE', null, { ...getAuthHeaders(), ...authHeaders }),

    revertCategory: (categoryId, historyId, authHeaders = {}) =>
        apiCall('/category/revert', 'POST', { categoryId, historyId }, { ...getAuthHeaders(), ...authHeaders }),
};

export const messageAPI = {
    retryBot: (messageId, categoryId, chatId, authHeaders = {}) =>
        apiCall('/message/retryBot', 'POST', { id: messageId, categoryId, chatId }, { ...getAuthHeaders(), ...authHeaders }),

    handleLike: (messageId, like, authHeaders = {}) =>
        apiCall('/message/handle-like', 'POST', { id: messageId, like }, { ...getAuthHeaders(), ...authHeaders }),

    updateBotMessage: (messageId, text, authHeaders = {}) =>
        apiCall('/message/updateBot', 'POST', { id: messageId, text }, { ...getAuthHeaders(), ...authHeaders }),

    updateUserMessage: (messageId, text, authHeaders = {}) =>
        apiCall('/message/updateUser', 'POST', { id: messageId, text }, { ...getAuthHeaders(), ...authHeaders }),

    deleteMessage: (messageId, authHeaders = {}) =>
        apiCall(`/message/delete/${messageId}`, 'DELETE', null, { ...getAuthHeaders(), ...authHeaders }),
};

export default apiCall;
