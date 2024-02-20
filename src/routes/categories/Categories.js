import React from "react";
import CategoriesList from "./partials/CategoriesList";
import { AppContext } from "../../App";
import { useRedirect } from "../../core/hooks/useRedirect";
import CategoryModal from "./partials/CategoryModal";
import { DeleteDialogModal, FloatingButton } from "../../core/elements/minitatures";
import { useTranslation } from "react-i18next";
import HelpPopover from "../../core/elements/HelpCenter/partials/HelpPopover";
import useButtonRightPosition from "../../core/hooks/useButtonRightPosition";

const Categories = React.memo(function () {
    const { AuthContext, HelpContext } = React.useContext(AppContext);

    useRedirect(AuthContext.state, true);

    const [component, setComponent] = React.useState({
        currentCategory: null,
        render: 0
    });

    const { t } = useTranslation();
    const { currentCategory } = component;

    const handleCurrentCategory = React.useCallback(function (category) {
        setComponent(C => {
            return { ...C, currentCategory: category };
        });
    }, []);

    const reRender = React.useCallback(function () {
        setComponent(C => {
            return { ...C, render: ++C.render };
        });
    }, []);

    const helpButtonPosition = useButtonRightPosition();

    if (AuthContext.state) {
        return <>
            <div className="container-fluid mt-4">
                <div className="col-lg-10 col">
                    <div className="mb-3">
                        <div className="display-5"><i className="fa fa-stream"></i> {t('categories')}</div>
                        <p>{t('categories_page_description')}</p>
                    </div>
                    <CategoriesList modal={"category"} handleCurrentCategory={handleCurrentCategory}
                        currentCategory={currentCategory} render={component.render} size="lg" />
                </div>
            </div>

            {HelpContext.state && <span style={{
                position: "fixed",
                bottom: '50px',
                right: helpButtonPosition
            }}>
                <HelpPopover
                    number={3}
                    type="button"
                    className="btn"
                    title={t('create_category')}
                    content={t('help_create_category_content')}>
                    <i className="fa fa-plus-circle fa-3x"></i>
                </HelpPopover>
            </span>}

            {!HelpContext.state &&
                <FloatingButton
                data-bs-toggle="modal"
                data-bs-target="#categoryModal"
                    onClick={() => { handleCurrentCategory(null) }} />}

            <CategoryModal currentCategory={currentCategory} reRender={reRender}
                handleCurrentCategory={handleCurrentCategory} />

            {currentCategory &&
                <DeleteDialogModal object={currentCategory} reRender={reRender}
                    handleCurrentObject={handleCurrentCategory} />}
        </>
    }
});


export default Categories;