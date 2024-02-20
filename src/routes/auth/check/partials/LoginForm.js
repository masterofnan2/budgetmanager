import React from "react";
import backend from "../../../../api/functions/backend";
import { AppContext } from "../../../../App";
import { Button, InputForm } from "../../../../core/elements/minitatures";
import { setSession } from "../../../../core/function/setSession";
import { useTranslation } from "react-i18next";
import * as Pusher from "../../../../api/functions/websocket";
import { HeightContext } from "../../../../core/elements/BsCarousel";

const LoginForm = React.memo(function () {

    const [component, setComponent] = React.useState({
        loading: false,
        AuthErrors: null
    });

    const { loading, AuthErrors } = component;

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

        if (!AuthContext.state) {
            let LoginData = {};
            const inputNumber = 2;

            setComponent(C => {
                return { ...C, loading: true };
            });

            for (let i = 0; i < inputNumber; i++) {
                const { name, value } = e.target[i];
                LoginData = { ...LoginData, [name]: value }
            }

            backend('/auth/login', LoginData, "post")
                .then(feedback => {
                    const { errors, data } = feedback;

                    if (data) {
                        setSession(AuthContext, data);
                        websocket.setChannel(Pusher.getChannel());
                    }

                    setComponent(C => {
                        return { ...C, loading: false, AuthErrors: errors }
                    })
                })
        }
    }, [AuthContext, websocket]);

    const { t } = useTranslation();

    return <>
        <div className="m-sm-5 my-5 h-100">
            <form onSubmit={handleSubmit} className="col-10 mx-auto ">
                <InputForm type="email" name="email" id="loginEmail" icon="at"
                    error={(AuthErrors && AuthErrors.email) || null} placeholder="username@example.com" />
                <InputForm type="password" name="password" id="loginPassword" icon="unlock-alt"
                    error={(AuthErrors && AuthErrors.password) || null} placeholder={t('your_password')} />

                <div className="row col-10 col-sm-6 col-md-6 mx-auto">
                    <Button variant="success" type="submit" icon="arrow-circle-right" loading={loading}>{t('log_in')}</Button>
                </div>
            </form>
            <p className="mt-4" style={{ textAlign: "center", color: "rgb(187, 187, 187)" }}>
                {t('no_account')} <a href="/auth/check" onClick={(e) => { e.preventDefault() }} className="text-primary" data-bs-target="#BsCarousel" data-bs-slide="next">{t('here')}
                </a>
            </p>
        </div>
    </>
});

export default LoginForm;
