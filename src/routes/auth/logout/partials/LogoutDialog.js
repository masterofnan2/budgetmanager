import React from "react";
import { AppContext } from "../../../../App";
import { Button } from "../../../../core/elements/minitatures";
import { setSession } from "../../../../core/function/setSession";
import { useTranslation } from "react-i18next";

const LogoutDialog = React.memo(function () {
    const { AuthContext } = React.useContext(AppContext);

    const handleLogoutClick = React.useCallback(function () {
        setSession(AuthContext)
    }, [AuthContext]);

    const { t } = useTranslation();

    return <>
        <div className="align-self-center mx-auto my-5" style={{ textAlign: "center" }}>
            <h1 className="mb-3">{t('disconnection_dialog')}</h1>
            <div className="row col-10 col-sm-6 col-md-6 mx-auto">
                <Button variant="danger col-10 mx-auto" type="button" onClick={handleLogoutClick} icon={"power-off"}>{t('log_out')}</Button>
            </div>
        </div>
    </>
});

export default LogoutDialog;