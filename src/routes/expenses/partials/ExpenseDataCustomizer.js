import React from "react";
import { useTranslation } from "react-i18next";
import backend from "../../../api/functions/backend";

const ExpenseDataCustomizer = React.memo(({ currentCategories, setCurrentCategories, currentCycle }) => {
    const [component, setComponent] = React.useState({
        categories: null
    });

    const { t } = useTranslation();

    React.useEffect(() => {
        backend('/categories/get', { cycle_id: currentCycle.id }, "POST")
            .then(Response => {
                if (Response.data) {
                    setComponent(C => {
                        return { ...C, categories: Response.data.categories };
                    })
                }
            });
    }, [currentCycle.id]);

    const handleChange = React.useCallback((e) => {
        const { checked, value } = e.target;
        let newCategories = [...currentCategories];
        if (checked) {
            if (newCategories.includes(parseInt(value))) {
                newCategories = newCategories.filter(id => id !== parseInt(value));
            }
        } else {
            if (!newCategories.includes(parseInt(value))) {
                newCategories.push(parseInt(value));
            }
        }
        setCurrentCategories(newCategories);
    }, [setCurrentCategories, currentCategories]);

    const allCategoriesId = React.useMemo(() => [], []);

    const handleDisplayAll = React.useCallback((e) => {
        const { checked } = e.target;
        if (checked) {
            setCurrentCategories([]);
        } else {
            setCurrentCategories(allCategoriesId);
        }
    }, [setCurrentCategories, allCategoriesId]);

    return <>
        {component.categories?.length ? <div>
            <div className="accordion" id="ExpenseDataCustomizerAccordion">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="ExpenseDataCustomizeAccordionHeading">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ExpenseDataCustomizerAccordionBody" aria-expanded="true" aria-controls="ExpenseDataCustomizerAccordionBody">
                            <span className="me-2 align-self-center"><i className="fa fa-sort"></i></span> <span className="align-self-center">{t('sort')}</span>
                        </button>
                    </h2>
                    <div id="ExpenseDataCustomizerAccordionBody" className="accordion-collapse collapse" aria-labelledby="ExpenseDataCustomizeAccordionHeading" data-bs-parent="#ExpenseDataCustomizerAccordion">
                        <div className="accordion-body">
                            <div className="mb-3 border-bottom">
                                <input
                                    type="checkbox"
                                    name="allCategories"
                                    className="me-2"
                                    id="allCategories"
                                    onChange={handleDisplayAll}
                                    checked={currentCategories.length ? false : true} />

                                <label htmlFor="allCategories">{t('see_all')}</label>
                            </div>
                            {component.categories.map(category => {

                                let checked = true;

                                if (currentCategories?.length) {
                                    if (currentCategories.includes(category.id)) {
                                        checked = false;
                                    }
                                }

                                if (!allCategoriesId.includes(category.id)) {
                                    allCategoriesId.push(category.id);
                                }

                                return <div className="my-1" key={category.id}>
                                    <input
                                        type="checkbox"
                                        name="category"
                                        className="me-2"
                                        id={`categoryCheckbox${category.id}`}
                                        value={category.id}
                                        checked={checked}
                                        onChange={handleChange} />

                                    <label htmlFor={`categoryCheckbox${category.id}`}>{category.name}</label>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div> : ""}
    </>
});

export default ExpenseDataCustomizer;