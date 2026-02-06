import { useCallback } from "react";
import { useLoading } from "../../common/hooks/useActive";
import { authAPI as baseAuthAPI } from "../../common/utils/api";

export const useAuthAPI = () => {
    const { activate: showLoading, deactivate: hideLoading } = useLoading();

    const withLoading = useCallback(async (apiFunction, showSpinner = true) =>{
        if (showSpinner) {
            showLoading();
        }
        try {
            const result = await apiFunction();
            return result;
        }finally {
            if (showSpinner) {
                hideLoading();
            }
        }
    }, [showLoading, hideLoading]);

    return{
        login: useCallback(
            (username, password, showSpinner = true) => withLoading(() => baseAuthAPI.login(username, password),
            showSpinner), [withLoading]
        ),
        register: useCallback(
            (username, email, password, showSpinner = true) => withLoading(() => baseAuthAPI.register(username, email, password),
            showSpinner), [withLoading]
        ),
        forgotPassword: useCallback(
            (email, showSpinner = true) => withLoading(() => baseAuthAPI.forgotPassword(email),
            showSpinner), [withLoading]
        ),
        verifyCode: useCallback(
            (email, code, showSpinner = true) => withLoading(() => baseAuthAPI.verifyCode(email, code),
            showSpinner), [withLoading]
        ),
        resetPassword: useCallback(
            (id, newPassword, showSpinner = true) => withLoading(() => baseAuthAPI.resetPassword(id, newPassword),
            showSpinner), [withLoading]
        ),
        logout: useCallback(
            (refreshToken, showSpinner = true) => withLoading(() => baseAuthAPI.logout(refreshToken),
            showSpinner), [withLoading]
        ),
    }
}