import React from "react";
import { budgetContext } from "../Budget";
import backend from "../../../api/functions/backend";
import CategoriesList from "../../categories/partials/CategoriesList";
import CategoriesSquare from "../../categories/partials/CategoriesSquare";
import { useTranslation } from "react-i18next";
import BudgetCategoryModal from "./BudgetCategoryModal";
import { AppContext } from "../../../App";
import HelpPopover from "../../../core/elements/HelpCenter/partials/HelpPopover";

export const assignedBudgetContext = React.createContext({ value: 0 });

const CategoriesBudget = React.memo(function ({ render }) {
    const [component, setComponent] = React.useState({
        allCategoriesDisplayed: false,
        assignedBudget: 0,
        currentCategory: null
    });

    const { budget } = React.useContext(budgetContext);

    const { t } = useTranslation();

    const handleAllCategoriesDisplayed = React.useCallback(function () {
        setComponent(C => {
            return { ...C, allCategoriesDisplayed: !C.allCategoriesDisplayed }
        });
    }, []);

    const setAssignedBudget = React.useCallback(function (amount) {
        setComponent(C => {
            return { ...C, assignedBudget: amount }
        });
    }, []);

    const handleCurrentCategory = React.useCallback(function (category) {
        setComponent(C => {
            return { ...C, currentCategory: category }
        });
    }, []);

    React.useEffect(() => {
        backend('/categories/budget/sum')
            .then(response => {
                if (response.data?.total) {
                    setAssignedBudget(response.data?.total);
                }
            });
    }, [budget, setAssignedBudget]);

    const { HelpContext } = React.useContext(AppContext);

    return <>
        <assignedBudgetContext.Provider value={{ value: component.assignedBudget, setAssignedBudget }}>
            <div className="mt-2 p-3 rounded text-light col-12" style={{ backgroundColor: "#846bae" }}>
                <div className="d-flex justify-content-between">
                    <p className="display-5"><i className="fa fa-chart-bar"></i> {t('budget_per_category')}</p>
                    {HelpContext.state &&
                        <HelpPopover
                            type="button"
                            className="btn align-self-center"
                            number={6}
                            title={t('help_see_all_categories')}
                            content={t('help_see_all_categories_description')}>
                                {t('see_all')}<i className="fa fa-angle-right"></i>
                        </HelpPopover>}

                    {!HelpContext.state &&
                        <div className="align-self-center" type="button" onClick={handleAllCategoriesDisplayed}>
                            {
                                component.allCategoriesDisplayed ?
                                    <> <i className="fa fa-angle-left"></i> {t('see_less')}</> :
                                    <> {t('see_all')}<i className="fa fa-angle-right"></i></>
                            }
                        </div>}
                </div>
                {component.allCategoriesDisplayed ?
                    <CategoriesList modal={"budget"} withBudget={true}
                        handleCurrentCategory={handleCurrentCategory} render={render} size={"md"} /> :
                    <CategoriesSquare withBudget={true} handleCurrentCategory={handleCurrentCategory}
                    />}
            </div>
            <BudgetCategoryModal currentCategory={component.currentCategory} />
        </assignedBudgetContext.Provider>
    </>
});

export default CategoriesBudget;