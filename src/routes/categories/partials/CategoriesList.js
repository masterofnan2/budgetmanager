import React from "react";
import backend from "../../../api/functions/backend";
import { Button, DisplayEmpty, SpinnerDisplayer } from "../../../core/elements/minitatures";
import { useTranslation } from "react-i18next";
import HelpPopover from "../../../core/elements/HelpCenter/partials/HelpPopover";
import { AppContext } from "../../../App";

const CategoriesList = React.memo(function ({ modal, limit, handleCurrentCategory, withBudget, render, size }) {
    const [categories, setCategories] = React.useState(null);

    const { HelpContext } = React.useContext(AppContext);

    React.useEffect(function () {
        backend((`/categories/${withBudget ? 'budget/' : ''}get`)
            + (limit ? `?limit=${limit}` : ''))
            .then(response => {
                if (response.data?.categories) {
                    setCategories(response.data.categories);
                }
            });
    }, [limit, withBudget, render]);

    const { t } = useTranslation();

    return <>
        {
            categories?.length > 0 &&
            <div className="accordion" id="allCategoriesAccordion">
                {
                    categories.map((category, key) => {
                        return <div className="accordion-item" key={key}>
                            <h2 className="accordion-header" id={`heading-${category.name}`}>
                                <div className={`accordion-button ${(HelpContext.state && key) === 0 ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse"
                                    data-bs-target={`#accordion-${category.name}`} aria-expanded="false"
                                    aria-controls={`accordion-${category.name}`}>
                                    {key === 0 &&
                                        <HelpPopover
                                            type="button"
                                            className={`btn ${category.variant}`}
                                            number={1}
                                            title={t('categories')}
                                            content={t('help_categories_content')}>
                                            <i className={`fa fa-${category.icon}`}></i> {category.name}
                                        </HelpPopover>}

                                    {key > 0 && <button className={`btn ${category.variant}`}>
                                        <i className={`fa fa-${category.icon}`}></i> {category.name}
                                    </button>}
                                </div>
                            </h2>
                            <div id={`accordion-${category.name}`} className={`accordion-collapse collapse ${(HelpContext.state && key === 0) ? 'show' : ''}`} aria-labelledby={`heading-${category.name}`} data-bs-parent="#allCategoriesAccordion">
                                <div className="accordion-body">
                                    <div className="d-flex justify-content-between">
                                        <div className="align-self-center flex-grow">
                                            {category.description}
                                        </div>
                                        {
                                            modal &&
                                            <div className="mb-2 align-self-start">
                                                {modal === "budget" &&
                                                    <Button
                                                        type="button"
                                                        className="btn d-flex"
                                                        childDNone={true}
                                                        icon='cog'
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#budgetCategoryModal"
                                                        onClick={() => { handleCurrentCategory(category) }}
                                                        style={{ backgroundColor: "#e7e7e7" }}>
                                                        {t('settings')}
                                                    </Button>}

                                                {modal === "category" &&
                                                    ((!HelpContext.state || key !== 0) ?
                                                    <Button
                                                        type="button"
                                                        icon="pen"
                                                        className="btn d-flex"
                                                        childDNone={true}
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#categoryModal"
                                                        onClick={() => { handleCurrentCategory(category) }}
                                                        style={{ backgroundColor: "#e7e7e7" }}>{t('edit')}</Button> :

                                                    <HelpPopover
                                                        number={2}
                                                        type="button"
                                                        className="btn btn-outline-dark"
                                                        title={t('help_edit_category')}
                                                        content={t('help_edit_category_content')}>
                                                        <i className="fa fa-pen"></i> {t('edit')}
                                                    </HelpPopover>)}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>
        }
        {
            categories?.length === 0 &&
            <DisplayEmpty size={size} />
        }
        {
            !categories && <SpinnerDisplayer />
        }
    </>
});

export default CategoriesList;