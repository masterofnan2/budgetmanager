import React from "react";
import { DisplayImage } from "../../../core/elements/minitatures";
import { useTranslation } from "react-i18next";

const NoLineChart = React.memo(() => {
    const {t} = useTranslation();
    
    return (
        <div className="d-flex justify-content-around rounded p-2 flex-wrap flex-sm-nowrap"
            style={{backgroundColor: "#e7e7e7"}}>
            <div className="col-lg-4 align-self-center me-0 me-sm-3">
                <DisplayImage imageName="no_chart" />
            </div>
            <div className="d-flex flex-column col-lg-6 align-self-center">
                <div className="display-5">{t('no_data_available')}</div>
                <small>
                        {t('no_data_available_description')}
                </small>
            </div>
        </div>
    );
});

export default NoLineChart;