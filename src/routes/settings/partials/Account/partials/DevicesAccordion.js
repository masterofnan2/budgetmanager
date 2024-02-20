import React from "react";
import { AppContext } from "../../../../../App";
import backend from "../../../../../api/functions/backend";
import useObserver from "../../../../../core/hooks/useObserver";
import { Button } from "../../../../../core/elements/minitatures";
import { useTranslation } from "react-i18next";

const DevicesAccordion = React.memo(function () {
    const [component, setComponent] = React.useState({
        tokenData: null,
        selectedDevices: [],
        loading: false
    });

    const { ToastContext, RenderContext } = React.useContext(AppContext);
    const { t } = useTranslation();

    const accordionBodyRef = React.useRef();

    const fetchTokens = React.useCallback(() => {
        backend('/token/get')
            .then(response => {
                setComponent(C => {
                    return { ...C, tokenData: response.data?.tokenData, selectedDevices: [], loading: false };
                });
            });

    }, []);

    const clearTokens = React.useCallback((targetTokens) => {
        setComponent(C => {
            return { ...C, loading: true };
        });

        backend('/token/clear', { tokens: targetTokens }, 'POST')
            .then(response => {
                if (response.data?.success) {
                    ToastContext.showToast({
                        title: t('success'),
                        icon: "check-circle",
                        body: t('devices_deleted')
                    });

                    if(targetTokens.includes(localStorage.getItem('token'))){
                        RenderContext.reRender();
                    }else{
                        fetchTokens();
                    }
                };
            });
    }, [ToastContext, t, fetchTokens, RenderContext]);

    const handleClick = React.useCallback((e) => {
        const payload = [e.currentTarget.getAttribute('data-bm-token')];
        clearTokens(payload);
    }, [clearTokens]);

    const handleChange = React.useCallback((e) => {
        if (e.target.checked) {
            setComponent(C => {
                return { ...C, selectedDevices: [...C.selectedDevices, e.target.value] };
            })
        } else {
            if (component.selectedDevices.includes(e.target.value)) {
                const newSelectedDevices = [...component.selectedDevices].filter(value => value !== e.target.value)
                setComponent(C => {
                    return { ...C, selectedDevices: newSelectedDevices };
                });
            }
        }
    }, [component.selectedDevices]);

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault();
        clearTokens(component.selectedDevices);
    }, [clearTokens, component.selectedDevices]);

    useObserver('class', accordionBodyRef, 'show', fetchTokens);

    return <>
        <div className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#devicesAccordionItem" aria-expanded="true" aria-controls="devicesAccordionItem">
                    <span><i className="fa fa-laptop"></i> {t('your_devices')}</span>
                </button>
            </h2>
            <div id="devicesAccordionItem" className="accordion-collapse collapse"
                aria-labelledby="headingOne" data-bs-parent="#accountAccordion" ref={accordionBodyRef}>
                <div className="accordion-body">
                    <form onSubmit={handleSubmit}>
                        <div className="d-flex justify-content-center">
                            {!component.tokenData && <div><i className="fa fa-spinner fa-spin fa-2x"></i></div>}
                            {component.tokenData?.length > 0 && <>
                                <ul className="list-group col-12 col-sm-10 col-md-8">
                                    {component.tokenData.map((token, key) => {
                                        const handleActive = token.value === localStorage.getItem('token') ? 'active' : '';
                                        return <li key={key}
                                            className={`list-group-item`}>
                                            <div className="d-flex justify-content-between flex-wrap">
                                                <div className="btn align-self-baseline flex-fill">
                                                    <input type="checkbox" name="devices" value={token.value}
                                                        className="form-check" onChange={handleChange} id={`tokenCheckbox${key}`} />
                                                </div>
                                                <div className={`d-flex justify-content-between flex-fill`} >
                                                    <label htmlFor={`tokenCheckbox${key}`}
                                                        className="align-self-center">
                                                        <i className={`fa fa-${token.icon}`}></i> {token.device} {handleActive && `(${t('this_device')})`}
                                                    </label>
                                                    <div className="dropdown open">
                                                        <button className="btn" type="button" id={`ellpsisDropdown${key}`} data-bs-toggle="dropdown" aria-haspopup="true"
                                                            aria-expanded="false">
                                                            <i className="fa fa-ellipsis-h"></i>
                                                        </button>
                                                        <div className="dropdown-menu" aria-labelledby={`ellpsisDropdown${key}`} style={{ textAlign: "center" }}>
                                                            <button type="button"
                                                                className="dropdown-item text-secondary"
                                                                data-bm-token={token.value}
                                                                onClick={handleClick}><i className="fa fa-sign-out-alt"></i> {t('log_out')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    })}
                                </ul>
                            </>
                            }
                        </div>
                        <div className="d-flex justify-content-end mt-2">
                            <Button type="submit"
                                className={`btn btn-danger ${component.selectedDevices.length < 1 ? "disabled" : ""}`}
                                icon="trash" loading={component.loading}>{t('delete')}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
});

export default DevicesAccordion;