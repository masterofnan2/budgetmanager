import React from "react";
import { budgetContext } from "../../budget/Budget";
import backend from "../../../api/functions/backend";
import { DisplayCategory, DisplayEmpty, SpinnerDisplayer } from "../../../core/elements/minitatures";
import getPercentage from "../../../core/function/getPercentage";
import { AppContext } from "../../../App";
import HelpPopover from "../../../core/elements/HelpCenter/partials/HelpPopover";
import { useTranslation } from "react-i18next";

const CategoriesSquare = React.memo(function ({ withBudget, handleCurrentCategory }) {
    const [categories, setCategories] = React.useState(null);
    const { budget } = React.useContext(budgetContext);

    const { t } = useTranslation();

    const { HelpContext } = React.useContext(AppContext);

    React.useEffect(function () {
        backend(`/categories/${withBudget ? 'budget/' : ''}get?limit=3`)
            .then(response => {
                setCategories(response.data.categories);
            });
    }, [budget, withBudget]);

    return <>
        {!categories && <SpinnerDisplayer />}
        {categories?.length === 0 &&
            <DisplayEmpty size="md" />}
        {categories?.length > 0 &&
            <>
                <div className="d-flex justify-content-around flex-wrap">
                    {
                        categories.map((category, key) => {
                            return <React.Fragment key={key}>
                                <div className="col-11 col-sm-10 col-md-3 mt-3 align-self-center">

                                    {(HelpContext.state && key === 0) && <HelpPopover
                                        type="button"
                                        className="btn"
                                        number={5}
                                        title={t('budget_per_category')}
                                        content={t('budget_per_category_content')}></HelpPopover>}
                                        
                                    <DisplayCategory category={category} amount={category.budget.amount}
                                        percentage={getPercentage(category.budget.amount, budget.amount)}
                                        handleCurrentCategory={handleCurrentCategory}
                                        withHelp={(HelpContext.state && key === 0)} />
                                        
                                </div>
                            </React.Fragment>
                        })
                    }
                </div>
            </>}
    </>
});

export default CategoriesSquare;