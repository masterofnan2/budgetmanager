import React from "react";
import { DisplayImage } from "../../../core/elements/minitatures";
import { BsCarousel } from "../../../core/elements/BsCarousel";
import { useRedirect } from "../../../core/hooks/useRedirect";
import { AppContext } from "../../../App";

import LoadingPage from "../../../core/elements/LoadingPage";
import LoginForm from "./partials/LoginForm";
import SignupForm from "./partials/SignupForm";
import { useTranslation } from "react-i18next";

const AuthCheck = React.memo(function () {
    const { AuthContext } = React.useContext(AppContext);

    useRedirect(AuthContext.state, false);

    const { t } = useTranslation();

    if (AuthContext.state) {
        return <LoadingPage />
    }

    return <>
        <div className="d-sm-flex d-block flex align-items-center mt-5 mt-md-0 pt-5 pt-md-0" style={{height: "100vh"}}>
            <div className="col-lg-10 col">
                <div className="container-lg">
                    <div className="mb-3 d-flex justify-content-center">
                        <div className="display-5">{t('who_are_you')}</div>
                    </div>
                    <div className="d-flex justify-content-around flex-wrap-reverse">
                        <div className="mx-auto mx-md-0 col-sm-5 col-md-4 col-lg-4 align-self-center mb-3">
                            <DisplayImage imageName="programmation" />
                        </div>
                        <div className="align-self-center rounded col-12 col-sm-10 col-md-6 mx-auto mx-md-0 mb-3"
                            style={{ backgroundColor: "#383333" }}>
                            <BsCarousel contents={[LoginForm, SignupForm]}
                                controls={true} childrenHeight="305" interval="30000"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
});

export default AuthCheck;