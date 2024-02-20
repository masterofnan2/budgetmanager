import React from "react";
import { useRedirect } from "../../../core/hooks/useRedirect";
import { AppContext } from "../../../App";
import LogoutImage from "./partials/LogoutImage";
import LogoutDialog from "./partials/LogoutDialog";

const Logout = React.memo(function () {
    const { AuthContext } = React.useContext(AppContext);
    const { state } = AuthContext;

    useRedirect(state, true);

    if (state) {
        return <>
            <div className="my-5">
                <div className="col-lg-10 col">
                    <div className="container">
                        <div className="d-flex flex-wrap-reverse flex-md-nowrap">
                            <LogoutImage />
                            <LogoutDialog />
                        </div>
                    </div>
                </div>
            </div>
        </>
    }
});

export default Logout;