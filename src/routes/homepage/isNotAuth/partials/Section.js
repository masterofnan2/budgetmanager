import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Section = React.memo(function () {
    const { t } = useTranslation();
    
    return <>
        <div className="container my-2 rounded p-2" style={{ backgroundColor: "#e7e9eb", textAlign: "center" }}>
            <div className="d-flex justify-content-around flex-wrap flex-md-nowrap" >
                <Link as="div" to='/auth/check?signup=true' className="card col-sm-4 my-1" style={{textDecoration: "none"}}>
                    <i className="fa fa-user-plus card-img-top my-2" style={{ fontSize: "50px", color: "#383333" }}></i>
                    <div className="card-footer">
                        <h5 className="card-title">{t('section_1_title')}</h5>
                        <small> {t('section_1_description')} </small>
                    </div>
                </Link>
                <div className="card col-sm-4 my-1">
                    <i className="fa fa-money-check card-img-top my-2" style={{ fontSize: "50px", color: "#383333" }}></i>
                    <div className="card-footer">
                        <h5 className="card-title">{t('section_2_title')}</h5>
                        <small>{t('section_2_description')}</small>
                    </div>
                </div>
                <div className="card col-sm-4 my-1">
                    <i className="fa fa-book-reader card-img-top my-2" style={{ fontSize: "50px", color: "#383333" }}></i>
                    <div className="card-footer">
                        <h5 className="card-title">{t('section_3_title')}</h5>
                        <small>{t('section_3_description')}</small>
                    </div>
                </div>
            </div>
        </div>
    </>
});

export default Section;