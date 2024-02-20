import React from "react";
import { DisplayImage } from "../core/elements/minitatures";
import { useTranslation } from "react-i18next";

const NotFound = React.memo(function () {
    const { t } = useTranslation();

    return <>
        <div className="container-fluid mt-5">
            <div className="col-lg-10 col">
                <div className="d-flex justify-content-around flex-wrap p-3 rounded"
                    style={{ backgroundColor: "#e7e7e7" }}>
                    <div className="align-self-center">
                        <div className="display-1">{t("not_found_title")}</div>
                        <p>{t("not_found_description")}</p>
                    </div>
                    <DisplayImage imageName="erreur_404" />
                </div>
            </div>
        </div>
    </>
});

export default NotFound;