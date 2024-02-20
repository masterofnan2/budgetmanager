import React from "react";
import backend from "../../../../api/functions/backend";
import { Button, InputForm } from "../../../../core/elements/minitatures";
import { AppContext } from "../../../../App";
import { setSession } from "../../../../core/function/setSession";
import { useTranslation } from "react-i18next";
import * as Pusher from "../../../../api/functions/websocket";
import { HeightContext } from "../../../../core/elements/BsCarousel";

const SignupForm = React.memo(function () {

    const [component, setComponent] = React.useState({
        AuthErrors: null,
        loading: false
    });

    const { AuthErrors, loading } = component;

    const { AuthContext, websocket } = React.useContext(AppContext);
    const alterHeight = React.useContext(HeightContext);

    React.useEffect(() => {
        if(AuthErrors){
            const errorsNumber = Object.keys(AuthErrors).length;
            alterHeight(errorsNumber);
        }
    }, [AuthErrors, alterHeight]);

    const handleSubmit = React.useCallback(function (e) {
        e.preventDefault();

        if (!AuthContext.state && !websocket.connections) {
            setComponent(C => {
                return { ...C, loading: true };
            });

            let SignupData = {};

            for (let i = 0; i < 3; i++) {
                SignupData = { ...SignupData, [e.target[i].name]: e.target[i].value }
            }

            backend('/auth/signup', SignupData, "post")
                .then(feedback => {
                    const { errors, data } = feedback;

                    if (data) {
                        sessionStorage.setItem('intended', JSON.stringify({ path: '/categories?help=true', aim: true }));
                        setSession(AuthContext, data);
                        websocket.setChannel(Pusher.getChannel());
                    }

                    setComponent(C => {
                        return { ...C, loading: false, AuthErrors: errors };
                    })
                })
        }
    }, [AuthContext, websocket]);

    const { t } = useTranslation();

    return <>
        <div className="m-sm-5 my-5 h-100">
            <form onSubmit={handleSubmit} className="col-10 mx-auto">
                <InputForm type="text" name="name" id="signupName" icon="user" placeholder={t('your_name')} error={(AuthErrors && AuthErrors.name)} />
                <InputForm type="email" name="email" id="signupEmail" icon="at" placeholder="username@example.com" error={(AuthErrors && AuthErrors.email)} />
                <InputForm type="password" name="password" id="signupPassword" icon="unlock-alt" placeholder={t('create_password')} error={(AuthErrors && AuthErrors.password)} />
                <div className="row col-10 col-sm-6 col-md-6 mx-auto">
                    <Button variant="primary" type="submit" icon="arrow-circle-right" loading={loading}>{t("create_account")}</Button>
                </div>
            </form>
        </div>
    </>
});

export default SignupForm;
