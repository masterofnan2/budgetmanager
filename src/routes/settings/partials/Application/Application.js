import React from "react"
import CurrencyAccordion from "./partials/CurrencyAccordion";
import LanguageAccordion from "./partials/LanguageAccordion";

const Application = React.memo(() => {
    return <div className="p-3 rounded mx-0 mt-5 mx-sm-3" style={{ backgroundColor: "#e7e7e7" }}>
        <div className="d-flex flex-column" >
            <div className="mb-1">
                <h5><i className="fa fa-user-circle"></i> Application</h5>
            </div>
            <div>
                <div className="accordion" id="applicationAccordion">
                    <LanguageAccordion />
                    <CurrencyAccordion />
                </div>
            </div>
        </div>
    </div>
});

export default Application;