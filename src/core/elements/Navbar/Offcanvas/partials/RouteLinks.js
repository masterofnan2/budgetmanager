import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../../../../../App";
import React from "react";
import { AuthUserDropdown } from "../../../minitatures";
import { useTranslation } from "react-i18next";

const routes = {
    authenticated:
        [{
            path: "/",
            label: "home",
            icon: "home"
        },
        {
            path: "/budget",
            label: "budget",
            icon: "money-check-alt"
        },
        {
            path: "/categories",
            label: "categories",
            icon: "stream"
        },
        {
            path: "/expenses",
            label: "expenses",
            icon: "donate"
        }],

    notAuthenticated:
        [{
            path: "/",
            label: "home",
            icon: "home"
        }, {
            path: "/auth/check",
            label: "account",
            icon: "user"
        }]
}

const RouteLinks = React.memo(() => {

    const { AuthContext, screenWidth } = React.useContext(AppContext);

    const location = useLocation();

    const current = React.useMemo(function () {
        return location.pathname;
    }, [location]);

    const { t } = useTranslation();

    return <>
        {
            AuthContext.state && <>
                {routes.authenticated.map((route, key) => {
                    return <div className={`mb-2 w-100 p-2 ${current === route.path && "bg-secondary text-light"}`}
                        data-bs-dismiss={screenWidth > 992 ? "" : "offcanvas"} key={key}>
                        <Link to={route.path} className="text-decoration-none" style={{ color: "#bbb" }}><i className={`fa fa-${route.icon}`}></i> {t(route.label)}</Link>
                    </div>
                })}

                <div style={{ position: 'absolute', bottom: '15px' }}>
                    <AuthUserDropdown screenWidth={screenWidth} />
                </div>
            </>
        }
        {
            !AuthContext.state && <>
                {routes.notAuthenticated.map((route, key) => {
                    return <div className={`mb-2 w-100 p-2 ${current === route.path && "bg-secondary text-light"}`}
                        data-bs-dismiss={screenWidth > 992 ? "" : "offcanvas"} key={key}>
                        <Link to={route.path} className="text-decoration-none" style={{ color: "#bbb" }}><i className={`fa fa-${route.icon}`}></i> {t(route.label)}</Link>
                    </div>
                })}
            </>
        }
    </>
});

export default RouteLinks;