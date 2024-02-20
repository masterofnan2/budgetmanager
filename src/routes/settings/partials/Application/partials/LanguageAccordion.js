import React from "react";
import { useTranslation } from "react-i18next";
import { ChangeLanguageForm } from "../../../../../core/elements/minitatures";

const LanguageAccordion = React.memo(() => {
    const { i18n, t } = useTranslation();

    return <div className="accordion-item">
        <h2 className="accordion-header" id="languageAccordionHeading">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target={`#languageAccordionCollapse`} aria-expanded="false" aria-controls={`languageAccordionCollapse`}>
                <span className="me-auto"><i className={`fa fa-language`}></i> {t('prefered_language')}</span>
                <br /><small className="text-success">{i18n.language}</small>
            </button>
        </h2>
        <div id="languageAccordionCollapse" className="accordion-collapse collapse"
            aria-labelledby="languageAccordionHeading"
            data-bs-parent="#applicationAccordion">
            <div className="accordion-body">
                <div className="col-md-6 mx-auto">
                    <div className="my-2">
                        {t('choose_language')}
                    </div>
                    <ChangeLanguageForm size="md" />
                </div>
            </div>
        </div>
    </div>
});

export default LanguageAccordion;