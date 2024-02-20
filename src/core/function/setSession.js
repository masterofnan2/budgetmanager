export const setSession = function (Auth, sessionData = { user: null, token: null, settings: null }) {
    const { state, setAuth } = Auth;
    const { token } = sessionData;

    const newAuth = { ...sessionData, state: !state };

    if (state) {
        localStorage.clear();
    } else {
        localStorage.setItem('token', token?.value);
    }

    setAuth(newAuth);
}