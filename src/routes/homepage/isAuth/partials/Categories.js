import React from "react";
import CategoriesList from "../../../categories/partials/CategoriesList";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../../../App";
import HelpPopover from "../../../../core/elements/HelpCenter/partials/HelpPopover";

const Categories = React.memo(function () {
    const { t } = useTranslation();

    const { HelpContext } = React.useContext(AppContext);

    return <>
        <nav className="navbar navbar-expand navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand" to='/categories'><i className="fa fa-stream"></i> {t('your_categories')}</Link>
                {HelpContext.state &&
                    <HelpPopover
                        type="button"
                        number={2}
                        className="btn"
                        title={t('categories')}
                        content={t('categories_limited_content')} />}
                <div className="d-flex">
                    <Link className="btn btn-dark" to='/categories'>
                        <i className="fa fa-external-link-alt"></i>
                    </Link>
                </div>
            </div>
        </nav>
        <CategoriesList limit={3} size="md" />
    </>
});

export default Categories;