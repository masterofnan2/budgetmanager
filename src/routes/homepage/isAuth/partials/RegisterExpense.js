import React from "react";
import { Button, FloatingInputForm, FloatingSelect } from "../../../../core/elements/minitatures";
import backend from "../../../../api/functions/backend";
import { AppContext } from "../../../../App";
import { Link } from "react-router-dom";
import { HomepageRenderContext } from "../isAuth";
import { useTranslation } from "react-i18next";
import HelpPopover from "../../../../core/elements/HelpCenter/partials/HelpPopover";

const RegisterExpense = React.memo(function () {
    const [component, setComponent] = React.useState({
        categories: [],
        errors: null,
        loading: false
    });

    const { categories, errors, loading } = component;
    const { ToastContext, HelpContext } = React.useContext(AppContext);

    const { showToast } = ToastContext;
    const { reRender } = React.useContext(HomepageRenderContext);

    const { t } = useTranslation();

    React.useEffect(() => {
        backend('/categories/budget/get')
            .then(response => {
                if (response.data) {
                    setComponent(C => {
                        return { ...C, categories: response.data.categories };
                    })
                }
            })
    }, []);

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault();
        setComponent(C => {
            return { ...C, loading: true };
        })

        let formData = { expenseAmount: '', expenseCategory: '' };

        for (let i = 0; i < e.target.children.length; i++) {
            if (e.target[i].name === "amount" || e.target[i].name === "category_id") {
                formData = { ...formData, [e.target[i].name]: e.target[i].value };
            }
        }

        backend('/expenses/set', formData, "POST")
            .then(response => {
                if (response.errors) {
                    setComponent(C => {
                        return { ...C, errors: response.errors };
                    });
                } else {
                    setComponent(C => {
                        return { ...C, errors: null };
                    });
                }

                if (response.data?.expense) {
                    showToast({
                        title: t('success'),
                        body: t('expense_saved'),
                        icon: 'check-circle'
                    });

                    reRender();
                }

                setComponent(C => {
                    return { ...C, loading: false };
                })
            });
    }, [reRender, showToast, t]);

    return <>
        <div className="d-flex justify-content-between flex-nowrap">
            <div className="align-self-center">
                <i className="fa fa-calculator"></i> {t('register_expense')} {HelpContext.state &&
                    <HelpPopover
                        type="button"
                        number={5}
                        className="btn"
                        title={t('quick_register_expense')}
                        content={t('quick_register_expense_content')} />}
            </div>
            <div className="dropup">
                <button className="btn" type="button" id="triggerId" data-bs-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
                    <i className="fa fa-ellipsis-v"></i>
                </button>
                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="triggerId">
                    <Link className="dropdown-item" to="/expenses?register=true">
                        <i className="fa fa-expand-alt"></i> {t('advanced')}
                    </Link>
                </div>
            </div>
        </div>
        <form className="d-flex flex-column" onSubmit={handleSubmit}>
            <div className="mb-2">
                <FloatingInputForm type="text" icon={"dollar-sign"}
                    id="expenseAmount" name="amount"
                    placeholder={t('expense_amount')} label={t('amount')}
                    error={errors?.amount || null} />
            </div>
            <div className="mb-2">
                <FloatingSelect label={t('category')}
                    id="expenseCategory" icon="stream" name="category_id"
                    options={categories} error={errors?.category_id || null} />
            </div>
            <Button className="btn btn-primary" type="submit" loading={loading}><i className="fa fa-check"></i> {t('save')}</Button>
        </form>
    </>
});

export default RegisterExpense;