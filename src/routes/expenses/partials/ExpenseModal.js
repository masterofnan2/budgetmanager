import React from "react";
import { AmountDisplayer, Button, FloatingInputForm, FloatingSelect } from "../../../core/elements/minitatures";
import backend from "../../../api/functions/backend";
import { AppContext } from "../../../App";
import { getIsoDate } from "../../../core/function/date";
import { useTranslation } from "react-i18next";
import useObserver from "../../../core/hooks/useObserver";

const ExpenseModal = React.memo(function ({ current, reRender, cycle }) {
    const [component, setComponent] = React.useState({
        errors: null,
        categories: [],
        formData: null,
        loading: false,
        available: 0
    });

    const { errors, categories, formData } = component;

    const { ToastContext } = React.useContext(AppContext);
    const { showToast } = ToastContext;

    const { t } = useTranslation();
    const expenseModalRef = React.useRef();
    const closeModalRef = React.useRef();

    React.useEffect(() => {
        if (current) {
            setComponent(C => {
                return {
                    ...C, formData: {
                        id: current.id,
                        amount: current.amount,
                        description: current.description,
                        date: current.date,
                        category_id: current.category_id
                    },
                    errors: null
                };
            });
        } else {
            setComponent(C => {
                return {
                    ...C, formData: {
                        amount: "",
                        description: "",
                        date: getIsoDate(),
                        category_id: (categories && categories[0] && categories[0].id) || ''
                    }
                };
            })
        }
    }, [current, categories]);

    const fetchCategories = React.useCallback(() => {
        if (categories.length < 1) {
            backend('/categories/get')
                .then(response => {
                    if (response.data?.categories) {
                        setComponent(C => {
                            return { ...C, categories: response.data?.categories }
                        });
                    }
                })
        }
    }, [categories]);

    const fetchAvailable = React.useCallback((category_id) => {
        if (category_id) {
            backend('/expenses/available', { category_id }, "POST")
                .then(response => {
                    if (response.data) {
                        setComponent(C => {
                            return { ...C, available: response.data.available };
                        })
                    }
                })
        }
    }, []);

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault();

        setComponent(C => {
            return { ...C, loading: true };
        });

        backend('/expenses/set', formData, "POST")
            .then(response => {
                setComponent(C => {
                    return { ...C, errors: response.errors || null, loading: false };
                });

                if (response.data?.expense) {
                    reRender();
                    closeModalRef.current.click();

                    showToast({
                        title: t('success'),
                        icon: "check-circle",
                        body: t('expense_set')
                    });
                }
            });
    }, [formData, reRender, showToast, t, closeModalRef]);

    const handleExpenseChange = React.useCallback((e) => {
        const { value, name } = e.target;
        setComponent(C => {
            return {
                ...C,
                formData:
                {
                    ...C.formData,
                    [name]: value
                }
            };
        });
    }, []);

    React.useEffect(() => {
        const category_id = component.formData?.category_id;
        category_id && fetchAvailable(category_id);
    }, [component.formData?.category_id, fetchAvailable]);

    useObserver('class', expenseModalRef, 'show', () => {
        fetchCategories();
        !current?.category_id && fetchAvailable(formData.category_id);
    });

    return <form className="modal fade"
        id="expenseModal"
        tabIndex="-1" role="dialog"
        aria-labelledby="expenseModalTitle"
        aria-hidden="true"
        onSubmit={handleSubmit}
        ref={expenseModalRef}>
        {formData &&
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="d-flex flex-column">
                            <h5 className="modal-title" id="expenseModalTitle"><i className="fa fa-chart-line"></i> {t('expense_details')}</h5>
                            {!current &&
                                <small>{t('register_expense')}</small>}
                        </div>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            ref={closeModalRef}></button>
                    </div>
                    <div className="modal-body">
                        <div className="d-flex flex-column">
                            <div className="mb-2">
                                <FloatingInputForm type="number" placeholder={t('expense_amount')}
                                    id="expenseAmount" name="amount" label={t('expense_amount')} icon="donate" error={errors?.amount}
                                    value={formData.amount} onChange={handleExpenseChange} />
                            </div>

                            <div className="my-4 p-3 border rounded">
                                <div className="alert alert-info">
                                    {t('available_budget')} : <strong><AmountDisplayer amount={component.available} /></strong>
                                </div>
                                <FloatingSelect options={categories} id="expenseCategory"
                                    name="category_id" label={t('expense_category')} icon="stream"
                                    error={errors?.category_id}
                                    value={formData.category_id}
                                    onChange={handleExpenseChange} />
                            </div>

                            <div className="mb-2">
                                <FloatingInputForm type="text" id="expenseDescription" label={t('expense_description')}
                                    icon="paragraph" placeholder={t('expense_description')} error={errors?.description}
                                    value={formData.description} name={t("description")}
                                    onChange={handleExpenseChange} />
                            </div>

                            <div className="mb-2">
                                <FloatingInputForm type="date" id="expenseDate" label={t("expense_date")}
                                    name="date" icon="calendar-alt"
                                    placeholder={t("expense_date")} error={errors?.date}
                                    min={cycle?.start_date}
                                    max={cycle?.end_date}
                                    value={formData.date}
                                    onChange={handleExpenseChange} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {formData?.id &&
                            <button type="button" className="btn btn-danger btn-sm"
                                data-bs-target="#deleteDialogModal" data-bs-toggle="modal"><i className="fa fa-trash"></i> {t('delete')}</button>}

                        <Button type="submit" variant="primary" icon="check"
                            loading={component.loading}>{t('save')}</Button>
                    </div>
                </div>
            </div>
        }
    </form>
});

export default ExpenseModal;