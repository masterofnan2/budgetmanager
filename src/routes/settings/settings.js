import React from "react";
import { AppContext } from "../../App";
import { useRedirect } from "../../core/hooks/useRedirect";
import Account from "./partials/Account/Account";
import Application from "./partials/Application/Application";

const Settings = React.memo(function () {
    const { AuthContext } = React.useContext(AppContext);

    useRedirect(AuthContext.state, true);

    if (AuthContext.state) {
        return <div className="container-fluid mt-4">
            <div className="col-lg-10 col">
                <Account />
                <Application />
            </div>
        </div>
    }
});

export default Settings;