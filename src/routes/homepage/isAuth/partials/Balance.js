import React from "react";
import backend from "../../../../api/functions/backend";
import { Link } from "react-router-dom";
import { HomepageRenderContext } from "../isAuth";
import { useTranslation } from "react-i18next";
import { AmountDisplayer } from "../../../../core/elements/minitatures";
import { AppContext } from "../../../../App";
import HelpPopover from "../../../../core/elements/HelpCenter/partials/HelpPopover";

const Balance = React.memo(function () {
    const [component, setComponent] = React.useState({
        balance: null
    });

    const { render } = React.useContext(HomepageRenderContext);
    const { HelpContext } = React.useContext(AppContext);

    const { t } = useTranslation();

    React.useEffect(() => {
        backend('/balance/get')
            .then(response => {
                setComponent(C => {
                    return { ...C, balance: response.data?.balance || 0.00 }
                });
            });
    }, [render]);

    return <>
        <div className="mb-4">
            <i className="fa fa-dollar-sign bg-light p-2 rounded-pill"></i>
            <Link className="btn btn-success float-end" to={'/budget'}>
                <i className="fa fa-coins"></i> {t('top_up')}
            </Link>
        </div>
        <div className="d-flex flex-column shadow-lg" style={{ textAlign: "center" }}>
            {HelpContext.state &&
                <HelpPopover
                    type="button"
                    number={1}
                    className="btn"
                    title={t('your_balance')}
                    content={t('balance_displayed_here')} />}

            <p className="mb-0" style={{ color: "#aaa" }}>{t('current_balance')}</p>
            <h1 className="text-light rounded mb-0">
                {component.balance === null && <span className="spinner-border"></span>}
                {component.balance !== null && <>
                    <AmountDisplayer amount={component.balance} />
                </>}
            </h1>
        </div>
    </>
});

export default Balance;