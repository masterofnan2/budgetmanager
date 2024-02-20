import React from "react";
import useObserver from "../../../../../core/hooks/useObserver";
import { AppContext } from "../../../../../App";
import backend from "../../../../../api/functions/backend";
import { Button, FloatingSelect } from "../../../../../core/elements/minitatures";
import { useTranslation } from "react-i18next";


const CurrencyAccordion = React.memo(() => {
    const [component, setComponent] = React.useState({
        currencies: null,
        loading: false
    });

    const { AuthContext, RenderContext, ToastContext } = React.useContext(AppContext);

    const { t } = useTranslation();

    const handleShow = React.useCallback(() => {
        backend('/currencies/get')
            .then(response => {
                if (response.data) {
                    setComponent(C => {
                        return { ...C, currencies: response.data.currencies };
                    });
                };
            });
    }, []);

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault();
        const currency_id = e.target[0]?.value;

        if (currency_id) {
            setComponent(C => {
                return { ...C, loading: true };
            });

            backend('/settings/update', { currency_id }, "POST")
                .then(response => {
                    if (response.data?.success) {
                        setComponent(C => {
                            return { ...C, loading: false };
                        });

                        RenderContext.reRender();

                        ToastContext.showToast({
                            icon: "check-circle",
                            body: t('currency_updated_body'),
                            title: t('currency_updated')
                        });
                    };
                });
        }
    }, [RenderContext, ToastContext, t]);

    const currencyAccordionRef = React.useRef();

    useObserver('class', currencyAccordionRef, 'show', handleShow);

    if (AuthContext.state) {
        return <div className="accordion-item">
            <h2 className="accordion-header" id="applicationCurrencyHeading">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target={`#applicationCurrencyCollapse`} aria-expanded="false" aria-controls={`applicationCurrencyCollapse`}>
                    <span className="me-auto"><i className={`fa fa-money-bill`}></i> {t('prefered_currency')}</span>
                    <br /><small className="text-success">
                        {AuthContext.settings.currency.name}
                    </small>
                </button>
            </h2>
            <div id="applicationCurrencyCollapse"
                className="accordion-collapse collapse"
                aria-labelledby="applicationCurrencyHeading"
                data-bs-parent="#applicationAccordion"
                ref={currencyAccordionRef}>
                <div className="accordion-body">

                    {!component.currencies && <div className="d-flex justify-content-center">
                        <i className="fa fa-spinner fa-spin fa-2x"></i>
                    </div>}
                    {component.currencies && <form className="col-md-6 mx-auto" onSubmit={handleSubmit}>
                        <div className="my-2">{t('choose_currency')}</div>
                        {component.currencies.length > 0 && <>
                            <FloatingSelect options={component.currencies}
                                defaultValue={AuthContext.settings.currency.id}
                                id="currenciesSelect"
                                label={t("currency")}
                                icon="money-bill-alt" />
                            <div className="d-flex justify-content-end">
                                <Button
                                    type="submit"
                                    icon="check"
                                    variant="secondary mt-3"
                                    loading={component.loading}>{t('save_changes')}</Button>
                            </div>
                        </>}
                    </form>}

                </div>
            </div>
        </div>
    }
});

export default CurrencyAccordion;