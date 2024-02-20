import React from "react";
import { AppContext } from "../../../../../App";
import backend from "../../../../../api/functions/backend";
import { Button, FloatingInputForm } from "../../../../../core/elements/minitatures";
import { useTranslation } from "react-i18next";

const FormAccordionItem = React.memo(({ label, icon, placeholder }) => {
    const [component, setComponent] = React.useState({
        formData: {
            [label]: placeholder || ""
        },
        errors: null,
        loading: false
    });

    const { formData, errors, loading } = component;

    const { RenderContext, ToastContext } = React.useContext(AppContext);
    const { showToast } = ToastContext;
    const { reRender } = RenderContext;

    const { t } = useTranslation();

    const handleFormChange = React.useCallback((e) => {
        const { name, value } = e.target;
        setComponent(C => {
            return { ...C, formData: { ...C.formData, [name]: value } };
        });
    }, []);

    const handleFormSubmit = React.useCallback(function (e) {
        e.preventDefault();

        let formData = (label === "password" || label === "email") ? {} : component.formData

        if (label === "password" || label === "email") {
            for (let i = 0; i < 2; i++) {
                formData = { ...formData, [e.target[i].name]: e.target[i].value };
            }
        }

        setComponent(C => {
            return { ...C, loading: true };
        })

        backend('/user/update', formData, "POST")
            .then(response => {
                setComponent(C => {
                    return { ...C, errors: response.errors || null, loading: false };
                });

                if (response.data?.success) {
                    showToast({
                        title: t('success'),
                        body: t('modification_saved'),
                        icon: "check-circle"
                    });

                    reRender();
                }
            });
    }, [label, showToast, reRender, component.formData, t]);

    return <>
        <div className="accordion-item clearfix">
            <div className="accordion-header" id={`${label}AccordionHeading`}>
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target={`#${label}Accordion`} aria-expanded="false" aria-controls={`${label}Accordion`}>
                    <span className="me-auto"><i className={`fa fa-${icon}`}></i> {t(label)}</span>
                    <br /><small className="text-success">{placeholder}</small>
                </button>
            </div>
            <div id={`${label}Accordion`} className="accordion-collapse collapse" aria-labelledby={`${label}AccordionHeading`} data-bs-parent="#accountAccordion">
                <div className="accordion-body">
                    <form onSubmit={handleFormSubmit}>
                        {label === "password" &&
                            <div className="d-flex flex-wrap justify-content-around">
                                <div className="mb-2 mb-md-0 col-md-5 col-sm-8 col-12">
                                    <FloatingInputForm type="password" icon={"key"} id={`currentPasswordAccordionForm`}
                                        name={"currentPassword"} placeholder={t('your_current_password')}
                                        label={t('your_current_password')} onChange={handleFormChange}
                                        error={errors?.currentPassword}
                                        autoComplete="password" />
                                </div>
                                <div className="mb-2 mb-md-0 col-md-5 col-sm-8 col-12">
                                    <FloatingInputForm type="password" icon={"shield-alt"} id={`newPasswordAccordionForm`}
                                        name={"newPassword"} placeholder={t('your_new_password')}
                                        label={t('your_new_password')} onChange={handleFormChange}
                                        error={errors?.password}
                                        autoComplete="new-password" />
                                </div>
                            </div>}
                        {label !== "password" && <>
                            <div className="mb-2 col-md-5 col-sm-8 col-12 mx-auto">
                                <FloatingInputForm type="text" icon={icon} id={`${label}accordionForm`}
                                    name={label} placeholder={t(`your_${label}`)}
                                    label={t(`your_${label}`)} value={formData[label]} onChange={handleFormChange}
                                    error={(errors && errors[label]) || null} />
                            </div>
                            {label === "email" && <div className="mb-2 col-md-5 col-sm-8 col-12 mx-auto">
                                <FloatingInputForm type="password" icon={"key"} id={`confirmPasswordForm`}
                                    name={"currentPassword"} placeholder={t('confirm_your_password')}
                                    label={t('your_current_password')} onChange={handleFormChange}
                                    error={errors?.currentPassword}
                                    autoComplete="password" />
                            </div>}
                        </>}
                        <div className="float-end my-2">
                            <Button type="submit" variant="secondary" icon="check" loading={loading}>{t('save_changes')}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
});

export default FormAccordionItem;