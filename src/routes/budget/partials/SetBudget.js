import React from "react";
import { budgetContext } from "../Budget";
import { AppContext } from "../../../App";
import backend from "../../../api/functions/backend";
import { formatDate } from "../../../core/function/date";
import { Button, FloatingInputForm, FloatingSelect } from "../../../core/elements/minitatures";
import { useTranslation } from "react-i18next";
import HelpPopover from "../../../core/elements/HelpCenter/partials/HelpPopover";

const SetBudget = React.memo(function () {

    const [component, setComponent] = React.useState({
        state: {},
        renewal_frequencies: null,
        errors: null,
        loading: false
    });

    const { state, renewal_frequencies, errors, loading } = component;
    const { amount, renewal_frequency_id, end_date, start_date} = state;

    const { budget, setBudget } = React.useContext(budgetContext);

    const { ToastContext, HelpContext } = React.useContext(AppContext);
    const { t } = useTranslation();


    React.useEffect(() => {
        if (!isNaN(budget.amount)) {
            const { amount, start_date, end_date, renewal_frequency_id } = budget;
            setComponent(C => {
                return { ...C, state: { amount, start_date, end_date, renewal_frequency_id } };
            });
        }
    }, [budget]);

    React.useEffect(() => {
        backend('/renewal_frequencies/get')
            .then(response => {
                const { renewal_frequencies } = response.data;
                if (renewal_frequencies) {
                    setComponent(C => {
                        return { ...C, renewal_frequencies }
                    })
                }
            })
    }, []);

    const handleSubmit = React.useCallback(function (e) {
        e.preventDefault();

        setComponent(C => {
            return { ...C, loading: true };
        })

        backend('/budget/update', state, "POST")
            .then(response => {
                setComponent(C => {
                    return { ...C, errors: response.errors || null, loading: false }
                });

                if (response.data?.budget) {
                    setBudget(response.data.budget);
                    ToastContext.showToast({
                        icon: "check-circle",
                        title: t('success'),
                        body: t('balance_saved'),
                        bg: "#846bae"
                    });
                }
            });
    }, [state, setBudget, ToastContext, t]);

    const handleChange = React.useCallback(function (e) {
        const { id, value } = e.target;
        setComponent(C => {
            if (id === "renewal_frequency_id") {
                return {
                    ...C, state: {
                        ...C.state,
                        [id]: value,
                        end_date: formatDate(start_date, parseInt(value))
                    }
                }
            }

            return { ...C, state: { ...C.state, [id]: value } }
        });
    }, [start_date]);

    if (renewal_frequencies) {
        return <>
            <div className="rounded p-3 col-12" style={{ backgroundColor: "#e7e9eb" }}>
                <div className="d-flex justify-content-center">
                    <div className="display-5"><i className="fa fa-money-check-alt"></i> {t('your_budget')}</div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="d-flex flex-wrap mt-3">
                        <div className="d-flex col-12 flex-row justify-content-around flex-wrap">
                            <div className="col-md-3 col-sm-5 col-10 my-2 align-self-center">
                                {HelpContext.state &&
                                    <HelpPopover
                                        number={1}
                                        type="floatingInput"
                                        title={t('help_main_budget')}
                                        content={t('help_main_budget_description')}
                                        placeholder={t('your_budget_amount')}
                                        icon={"donate"}
                                        label={t('amount')}
                                        value={amount} />}

                                {!HelpContext.state &&
                                    <FloatingInputForm type={"number"} id={"amount"} placeholder={t('your_budget_amount')}
                                        min={0} max={99999999} onChange={handleChange} icon={"donate"} label={t('amount')}
                                        value={amount} error={errors?.amount || null} />}
                            </div>
                            <div className="col-md-3 col-sm-5 my-2 col-10 align-self-center">
                                <div className="form-floating">
                                    {HelpContext.state &&
                                        <HelpPopover
                                            number={2}
                                            type="floatingSelect"
                                            title={t('renewal_frequency')}
                                            content={t('help_renewal_frequency_description')}
                                            options={renewal_frequencies}
                                            label={t('renewal_frequency')}
                                            icon={"sync"}
                                        />}

                                    {!HelpContext.state &&
                                        <FloatingSelect id={"renewal_frequency_id"} onChange={handleChange}
                                            value={renewal_frequency_id}
                                            options={renewal_frequencies}
                                            label={t('renewal_frequency')}
                                            icon={"sync"}
                                            error={errors?.renewal_frequency_id || null} />}
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-5 my-2 col-10">
                                <div className="mb-2">
                                    {HelpContext.state &&
                                        <HelpPopover
                                            number={3}
                                            type="floatingInput"
                                            title={t('start_date')}
                                            content={t('help_start_date_description')}
                                            label={t('start_date')}
                                            icon="calendar-minus"
                                            value={start_date}
                                        />}

                                    {!HelpContext.state &&
                                        <FloatingInputForm
                                            type={"date"}
                                            id={"start_date"}
                                            label={t('start_date')}
                                            icon={"calendar-minus"}
                                            value={start_date}
                                            readOnly={true} />}
                                </div>
                                <div className="mb-2">

                                    {HelpContext.state &&
                                        <HelpPopover
                                            number={4}
                                            title={t('next_renewal_date')}
                                            content={t('help_next_renewal_date_description')}
                                            type="floatingInput"
                                            value={end_date}
                                            label={t("next_renewal_date")}
                                            icon={"calendar-plus"} />}

                                    {!HelpContext.state &&
                                        <FloatingInputForm type={"date"} id={"end_date"}
                                            onChange={handleChange}
                                            value={end_date}
                                            min={start_date}
                                            label={t("next_renewal_date")} icon={"calendar-plus"}
                                            readOnly={parseInt(renewal_frequency_id) !== 1}
                                            error={errors?.end_date || null} />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-row-reverse">
                        <Button type="submit" variant={"secondary"} icon={"save"} loading={loading}>{t("save_changes")}</Button>
                    </div>
                </form>
            </div>
        </>
    }
});


export default SetBudget;