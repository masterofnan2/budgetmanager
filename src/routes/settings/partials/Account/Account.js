import React from "react";
import FormAccordionItem from "./partials/FormAccordionItem";
import { AppContext } from "../../../../App";
import DevicesAccordion from "./partials/DevicesAccordion";
import { useTranslation } from "react-i18next";

const Account = React.memo(function () {
    const { AuthContext } = React.useContext(AppContext);
    const { user } = AuthContext;

    const { t } = useTranslation();

    if (user) {
        return <div className="m-0 m-sm-3 p-3 rounded" style={{ backgroundColor: "#e7e7e7" }}>
            <div className="d-flex flex-column">
                <div className="mb-1">
                    <h5> <i className="fa fa-user-circle"></i> {t('account')}</h5>
                </div>
                <div className="accordion" id="accountAccordion">
                    <FormAccordionItem label="name" placeholder={user.name} icon={"user"} />
                    <FormAccordionItem label="email" placeholder={user.email} icon={"envelope"} />
                    <FormAccordionItem label="password" icon={"lock"} />
                    <DevicesAccordion />
                </div>
            </div>
        </div>
    }
});

export default Account;