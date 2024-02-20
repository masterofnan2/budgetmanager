import React from "react";
import { DisplayImage } from "../../../../core/elements/minitatures";
import { useTranslation } from "react-i18next";

const LogoutImage = React.memo(function () {
    const { t } = useTranslation();

    return <>
        <div className="d-flex flex-column col-12 col-md-6 rounded mt-3 p-3" style={{ backgroundColor: "#e7e9eb" }}>
            <p className="display-5 mx-auto">{t('will_be_safe')}</p>
            <div className="mx-auto">
                <DisplayImage imageName="bye"/>
            </div>
            <div>
                <DisplayImage imageName="see_you_soon"/>
            </div>
        </div>
    </>
});

export default LogoutImage;