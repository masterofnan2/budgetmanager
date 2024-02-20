import React from "react";
import { assignedBudgetContext } from "./CategoriesBudget";
import { budgetContext } from "../Budget";
import { AppContext } from "../../../App";
import { useTranslation } from "react-i18next";
import backend from "../../../api/functions/backend";
import { AmountDisplayer, Button, FloatingInputForm } from "../../../core/elements/minitatures";

const BudgetCategoryModal = React.memo(function ({ currentCategory }) {

    const [component, setComponent] = React.useState({
        loading: false,
        amount: '',
        error: null,
    });

    const { loading, amount, error } = component;

    const assignedBudget = React.useContext(assignedBudgetContext);
    const { budget, reRender } = React.useContext(budgetContext);

    const { ToastContext } = React.useContext(AppContext);
    const { showToast } = ToastContext;

    const { t } = useTranslation();
    const closeModalRef = React.useRef();

    React.useEffect(() => {
        if (currentCategory) {
            setComponent(C => {
                return { ...C, amount: currentCategory.budget?.amount || '' };
            });
        }
    }, [currentCategory]);

    const handleCategoriesAmountChange = React.useCallback(function (e) {
        const { value } = e.target;
        setComponent(C => {
            return { ...C, amount: value }
        });
    }, []);

    const handleBudgetCategoryModalSubmit = React.useCallback(function (e) {
        e.preventDefault();
        if (currentCategory) {
            setComponent(C => {
                return { ...C, loading: true };
            });

            backend(`/categories/budget/set`, {
                id: currentCategory.budget.id,
                category_id: currentCategory.id,
                amount: amount
            }, "POST")
                .then(response => {
                    if (response.data?.category) {
                        showToast({
                            title: t('success'),
                            body: t('action_saved'),
                            icon: "check"
                        });

                        closeModalRef.current.click();
                        reRender();
                    }

                    setComponent(C => {
                        return { ...C, loading: false, error: response.errors?.amount };
                    });
                });
        }
    }, [currentCategory, amount, reRender, showToast, t]);

    return <>
        <form className="modal fade" id="budgetCategoryModal" tabIndex="-1"
            data-bs-keyboard="false" role="dialog" aria-labelledby="#budgetCategoryModalTitle"
            aria-hidden="true" onSubmit={handleBudgetCategoryModalSubmit}>
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered"
                role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="d-flex flex-wrap">
                            <h5 className="modal-title" id="budgetCategoryModalTitle">
                                <AmountDisplayer amount={budget.amount - assignedBudget.value} />
                            </h5>
                            <small className="align-self-center mx-2">{t('not_assigned')}</small>
                        </div>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            ref={closeModalRef}></button>
                    </div>
                    <div className="modal-body" style={{ textAlign: "center" }}>
                        <FloatingInputForm type={"number"} label={currentCategory?.name || ''} id="categoryBudgetAmount"
                            onChange={handleCategoriesAmountChange} icon={currentCategory?.icon || ''}
                            error={error} placeholder={t('your_budget_amount')} value={amount} />
                        {!error &&
                            <small className="text-success">{t('set_budget_category')}</small>}
                    </div>
                    <div className="modal-footer">
                        <Button type={"submit"} icon={"save"} variant={"secondary"}
                            loading={loading}>
                            {t('save')}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    </>
});

export default BudgetCategoryModal;