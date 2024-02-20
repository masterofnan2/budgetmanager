import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useRedirect(state, aim = null) {

    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const sessionIntended = sessionStorage.getItem('intended') && JSON.parse(sessionStorage.getItem('intended'));

    useEffect(() => {
        if (state !== aim && aim !== null && currentPath !== "/auth/logout") {
            const intended = {
                path: currentPath,
                aim
            }
            sessionStorage.setItem('intended', JSON.stringify(intended));
        }
    }, [state, aim, currentPath])

    useEffect(() => {
        if (state !== aim && aim !== null) {
            if (sessionIntended && sessionIntended.aim === state) {
                sessionStorage.removeItem('intended');
                navigate(sessionIntended.path);
            } else {
                navigate(aim ? '/auth/check' : '/');
            }
        }
    }, [state, aim, sessionIntended, navigate])
}