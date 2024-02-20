import React from "react";
import { DisplayImage } from "../../../../core/elements/minitatures";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../../App";
import HelpPopover from "../../../../core/elements/HelpCenter/partials/HelpPopover";
import { useTranslation } from "react-i18next";

const OverView = React.memo(function () {

    const navigate = useNavigate();
    const { HelpContext } = React.useContext(AppContext);
    const { t } = useTranslation();

    const handleClick = React.useCallback(() => {
        navigate('/overview');
    }, [navigate]);

    return <div
        className="rounded p-3 col-12 col-sm-5 col-md-3 text-light mt-2 mt-md-0 align-self-center"
        style={{ backgroundColor: "#212529" }} type="button" onClick={handleClick}>
        <h5>
            <i className="fa fa-chart-pie"></i>verview {HelpContext.state &&
                <HelpPopover
                    type="button"
                    number={4}
                    className="btn"
                    title={t('overview')}
                    content={t('overview_content')} />}
        </h5>

        <div className="d-flex justify-content-around flex-wrap">
            <div className="mt-3">
                <DisplayImage imageName="bar_chart" containerClass="mx-auto" />
            </div>
        </div>
    </div>
});

export default OverView;