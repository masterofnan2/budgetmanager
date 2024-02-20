import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthCheck from "./routes/auth/check/check";
import HomePage from "./routes/homepage/Homepage";
import LoadingPage from "./core/elements/LoadingPage";
import backend from "./api/functions/backend";
import Logout from "./routes/auth/logout/logout";
import Balance from "./routes/budget/Budget";
import { Toasts } from "./core/elements/minitatures";
import Categories from "./routes/categories/Categories";
import NotFound from "./routes/NotFound";
import Expenses from "./routes/expenses/Expenses";
import Settings from "./routes/settings/settings";
import useResize from "./core/hooks/useResize";
import { useTranslation } from "react-i18next";
import Navbar from "./core/elements/Navbar/Navbar";
import Overview from "./routes/overview/Overview";
import HelpCenter from "./core/elements/HelpCenter/HelpCenter";
import * as Pusher from './api/functions/websocket';

export const AppContext = React.createContext({
    AuthContext: {},
    ToastContext: {},
    RenderContext: {},
    screenWidth: null,
    websocket: {}
});

const App = React.memo(function () {

    const [component, setComponent] = React.useState({
        render: 0,
        Auth: { state: null, user: null, settings: null },
        toast: {},
        help: {},
        websocket: {}
    });

    const { render, Auth, toast, help, websocket } = component;

    const screenWidth = useResize();

    const { i18n, t } = useTranslation();

    const showToast = React.useCallback(function (props) {
        setComponent(C => {
            return { ...C, toast: { state: true, props } };
        });

        setTimeout(() => {
            setComponent(C => {
                return { ...C, toast: { state: false, props: {} } };
            });
        }, 3000);
    }, []);

    React.useEffect(() => {
        if (Auth.state && (i18n.language !== Auth.settings.language)) {
            i18n.changeLanguage(Auth.settings.language);

            if (document.documentElement.lang !== Auth.settings?.language) {
                document.documentElement.lang = Auth.settings.language;
            }
        }
    }, [Auth, i18n]);

    React.useEffect(() => {
        if (!Auth.state && websocket.channel) {
            websocket.channel.disconnect();
        }
    }, [Auth.state, websocket.channel])

    React.useEffect(() => {
        backend('/auth/check')
            .then(response => {
                if (response.data) {
                    const { authenticated, user, settings } = response.data;

                    setComponent(C => {
                        if (authenticated) {
                            const channel = Pusher.getChannel();
                            return {
                                ...C, Auth: { ...C.Auth, state: authenticated, user, settings },
                                websocket: { channel }
                            };
                        } else {
                            return { ...C, Auth: { ...C.Auth, state: false, user: {}, settings: {} } };
                        }
                    });

                    if (response.errors) {
                        showToast({
                            icon: "exclamation-circle",
                            title: t('error_occured'),
                            body: response.errors.message,
                            bg: "red"
                        });
                    };
                };
            });
    }, [render, showToast]);

    const setChannel = React.useCallback((channel) => {
        setComponent(C => {
            return { ...C, websocket: { ...C.websocket, channel } }
        })
    }, []);

    const setAuth = React.useCallback(function (Auth) {
        setComponent(C => {
            return { ...C, Auth };
        });
    }, []);

    const setHelp = React.useCallback((help) => {
        setComponent(C => {
            return { ...C, help }
        })
    }, [])

    const AuthContext = React.useMemo(function () {
        return { ...Auth, setAuth };
    }, [Auth, setAuth]);

    const HelpContext = React.useMemo(function () {
        return { ...help, setHelp };
    }, [help, setHelp]);

    const reRender = React.useCallback(function () {
        setComponent(C => {
            return { ...C, render: ++C.render };
        })
    }, []);

    const AppContextValue = React.useMemo(() => {
        return {
            AuthContext,
            screenWidth,
            RenderContext: { reRender },
            ToastContext: { showToast },
            HelpContext,
            websocket: { ...websocket, setChannel }
        }
    }, [AuthContext,
        screenWidth,
        reRender,
        showToast,
        websocket,
        setChannel,
        HelpContext]);

    return <AppContext.Provider value={AppContextValue}>
        {Auth.state === null && <LoadingPage />}
        {Auth.state !== null && <>
            <Navbar />
            <HelpCenter />
            {toast.state && <Toasts {...toast.props} />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/budget" element={<Balance />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/overview" element={<Overview />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/auth/check" element={<AuthCheck />} />
                <Route path="/auth/logout" element={<Logout />} />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </>}
    </AppContext.Provider >
});

export default App;