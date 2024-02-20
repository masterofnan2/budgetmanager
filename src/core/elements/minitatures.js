import React from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../App";
import backend from "../../api/functions/backend";
import imagesData from "../storage/imagesData";
import { useTranslation } from "react-i18next";
import useButtonRightPosition from "../hooks/useButtonRightPosition";
import HelpPopover from "./HelpCenter/partials/HelpPopover";
import { dateFormater } from "../function/date";
import useModalToggleObserver from "../hooks/useModalToggleObserver";
import { languageVariants } from "../function/initTranslation";

export const SpinnerDisplayer = React.memo(() => (
    <div className="d-flex justify-content-center mt-4">
        <div className="spinner-border spinner-border-lg"></div>
    </div>
))

export const CycleForm = React.memo(function ({ cycles, setCurrentCycle, currentCycle }) {
    const { t } = useTranslation();
    const { HelpContext } = React.useContext(AppContext);

    const handleChange = React.useCallback((e) => {
        const { value } = e.target;
        setCurrentCycle(parseInt(value));
    }, [setCurrentCycle]);

    return (
        <div className="d-flex justify-content-around flex-wrap bg-secondary p-3 text-light rounded">
            <div className="mt-2">
                <h5 className="m-0"><i className="fa fa-sync"></i> {t('choose_cycle')}</h5>
                <small>{t('choose_cycle_description')}</small>
            </div>
            <div className="form-floating col-lg-4 align-self-center mt-2">
                <select className="form-select" name="cycle" id="cycleForm" onChange={handleChange} value={currentCycle.id}>
                    {cycles.map((cycle) => {
                        let optionChild = null;

                        if (!cycle.start_date || !cycle.end_date) {
                            optionChild = t('all_time_cycle');
                        } else {
                            const start_date = dateFormater(cycle.start_date);
                            const end_date = dateFormater(cycle.end_date)

                            optionChild = `${start_date} - ${end_date}`;
                        }

                        return <option value={cycle.id} key={cycle.id}>{optionChild}</option>
                    })}
                </select>
                <label htmlFor="cycleForm"><i className="fa fa-sync"></i> Cycle</label>
            </div>
            {HelpContext.state &&
                <HelpPopover
                    type="button"
                    number={2}
                    data-bs-placement="top"
                    className="btn"
                    title={t('choose_cycle')}
                    content={t('choose_cycle_description')} />}
        </div>
    );
});

export const AmountDisplayer = React.memo(({ amount }) => {
    const { AuthContext } = React.useContext(AppContext);
    const { currency } = AuthContext.settings;
    const { i18n } = useTranslation();

    const options = React.useMemo(() => ({
        style: "currency",
        currency: currency.name,
        currencyDisplay: "symbol"
    }), [currency.name]);

    const currentLanguage = React.useMemo(() => i18n.language, [i18n.language]);
    const finalAmount = React.useMemo(() => amount || 0, [amount]);

    return finalAmount.toLocaleString(languageVariants[currentLanguage], options);
});

export const ChangeLanguageForm = React.memo(function ({ size }) {

    const { i18n, t } = useTranslation();
    const { AuthContext, ToastContext } = React.useContext(AppContext);

    const availableLanguages = React.useMemo(() => [
        {
            lang: "en",
            name: "English"
        },
        {
            lang: "fr",
            name: "Français"
        },
        {
            lang: "es",
            name: "español"
        }
    ], []);

    const handleLanguageChange = React.useCallback((e) => {
        const newLanguage = availableLanguages.find(language => language.lang === e.target.value);

        if (newLanguage && (i18n.language !== newLanguage)) {
            i18n.changeLanguage(newLanguage.lang);
            document.documentElement.lang = newLanguage.lang;

            if (AuthContext.state && newLanguage) {
                backend('/settings/update', { language: e.target.value }, "POST")
                    .then(response => {
                        if (response.data?.success) {
                            ToastContext.showToast({
                                icon: "check-circle",
                                body: t('language_changed_body'),
                                title: t('language_changed')
                            });
                        };
                    });
            };
        }

    }, [availableLanguages, AuthContext.state, ToastContext, i18n, t]);

    return <div className="input-group">
        <select className={`form-select form-select-${size}`} name="applicationLanguage" id="applicationLanguageForm"
            value={i18n.language} onChange={handleLanguageChange}>
            {availableLanguages.map((language, key) => {
                return <option key={key} value={language.lang}>{language.name}</option>
            })}
        </select>
        <span className="input-group-text"><i className="fa fa-language"></i></span>
    </div>
});

export const DisplayEmpty = React.memo(function ({ size }) {
    return <>
        <div className="d-flex justify-content-around rounded p-3 flex-wrap" style={{ backgroundColor: "#e7e7e7" }}>
            <div className="align-self-center text-dark">
                {size === "sm" && <p>Oops! There's nothing here</p>}
                {size === "md" && <h3>Oops! There's nothing here</h3>}
                {size === "lg" && <div className="display-5">Oops! There's nothing here</div>}
            </div>
            <DisplayImage imageName={`boite_${size}`} />
        </div>
    </>
});

export const DeleteDialogModal = React.memo(function ({ object, reRender, handleCurrentObject }) {
    const [loading, setLoading] = React.useState(false);

    const { ToastContext } = React.useContext(AppContext);
    const { showToast } = ToastContext;

    const { t } = useTranslation();

    const closeModalRef = React.useRef();

    const handleDelete = React.useCallback(function () {

        setLoading(true);
        const uri = object.name ? '/categories/delete' : '/expenses/delete';
        backend(uri, { id: object.id }, "POST")
            .then(response => {
                setLoading(false);
                if (response.data.success) {
                    showToast({
                        title: t('success'),
                        body: t('object_deleted'),
                        icon: "check-circle"
                    });

                    handleCurrentObject(null);
                    closeModalRef.current.click();

                    reRender();
                }
            });
    }, [object, reRender, showToast, handleCurrentObject, t]);

    return <>
        <div className="modal fade" id="deleteDialogModal" tabIndex="-1" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog" aria-labelledby="deleteModalTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-sm" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="d-flex flex-column">
                            <h5 className="modal-title" id="deleteModalTitle"><i className="fa fa-exclamation-triangle"></i> {t('are_you_sure')}</h5>
                            <small className="text-secondary">{t('action_not_reversible')}</small>
                        </div>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {object.name &&
                            <DisplayCategory category={object} />}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-success" data-bs-dismiss="modal"
                            ref={closeModalRef}>{t('cancel')}</button>

                        <Button
                            type="button"
                            variant="danger"
                            icon="trash"
                            onClick={handleDelete}
                            loading={loading}>{t('delete')}</Button>
                    </div>
                </div>
            </div>
        </div>
    </>
});

export const Toasts = React.memo(function ({ icon, title, body, bg }) {
    return <>
        <div className="container-fluid" style={{ position: "fixed", zIndex: 2000 }}>
            <div className="col-lg-10 ">
                <div className="float-end">
                    <div className="toast show w-auto">
                        <div className="toast-header rounded">
                            <strong className="me-auto"><i className={`fa fa-${icon || "exclamation-triangle"}`}></i> {title || "unknown action"}</strong>
                            <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
                        </div>
                        <div className="toast-body text-light rounded-bottom" style={{ backgroundColor: bg || "#456" }}>
                            {body || "Something may've went wrong"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
});

export const AuthUserDropdown = React.memo(function () {
    const { AuthContext, screenWidth } = React.useContext(AppContext);
    const { user } = AuthContext;

    const { t } = useTranslation();

    if (user) {
        return <>
            <div className="dropdown">
                <div className="d-flex border border-success shadow p-1 rounded" type='button'
                    id="authUserDropdown" data-bs-toggle="dropdown" aria-haspopup="true"
                    aria-expanded="false">
                    <div className="align-self-center">
                        <i className="fa fa-user-circle text-light" style={{ fontSize: "30px" }}></i>
                    </div>
                    <div className="ms-2">
                        <p className="mb-0" style={{ color: "#bbb" }}>{user.name || "not connected"}</p>
                        <p className="text-secondary mb-0" style={{ fontSize: "12px" }}>{user.email}</p>
                    </div>
                </div>
                <div className="dropdown-menu" aria-labelledby="authUserDropdown" style={{ textAlign: "center" }}
                    data-bs-dismiss={screenWidth > 992 ? "" : "offcanvas"}>
                    <Link className="dropdown-item" to="/auth/logout"><i className="fa fa-power-off"></i> {t('log_out')}</Link>
                    <Link className="dropdown-item" to="/settings"><i className="fa fa-cog"></i> {t('settings')}</Link>
                </div>
            </div>
        </>
    }
});

export const FloatingSelect = React.memo(function (props) {
    let selectProps = React.useMemo(() => { return {} }, []);
    const notSelectProps = ['options', 'icon', 'label', 'error'];

    for (let prop in props) {
        if (!notSelectProps.includes(prop)) {
            selectProps = { ...selectProps, [prop]: props[prop] };
        }
    }

    return <>
        <div className="form-floating" style={{ textAlign: "center" }}>
            <select className={`form-select ${props.error ? 'is-invalid' : ''}`} {...selectProps}>
                {
                    props.options && props.options.length > 0 && props.options.map((option, key) => {
                        return <React.Fragment key={key}>
                            <option value={option.id}>
                                {option.name}
                            </option>
                        </React.Fragment>
                    })
                }
            </select>

            <label htmlFor={props.id}><i className={`fa fa-${props.icon || ""}`}></i> {props.label}</label>
            {props.error && <div className="invalid-feedback">
                {props.error}
            </div>}
        </div>
    </>
});

export const FloatingInputForm = React.memo(function (props) {

    let inputProps = React.useMemo(() => { return {} }, []);

    for (let prop in props) {
        if (prop !== "label" && prop !== "error" && prop !== "icon" && prop !== "ref") {
            inputProps = { ...inputProps, [prop]: props[prop] }
        }
    }

    return <div className="form-floating" style={{ textAlign: "center" }}>
        <input className={`form-control ${props.error ? "is-invalid" : ""}`} {...inputProps} ref={props.ref || null} />

        <label htmlFor={props.id}>
            <i className={`fa fa-${props.icon}`}></i> {props.label}
        </label>

        {
            props.error &&
            <div className="invalid-feedback">
                {props.error}
            </div>
        }
    </div>
});

export const FloatingTextAreaForm = React.memo(function (props) {
    const textAreaProps = React.useMemo(() => { return {} }, []);
    for (let prop in props) {
        if (prop !== "error" && prop !== "icon") {
            textAreaProps[prop] = props[prop];
        }
    }

    return <>
        <div className="form-floating" style={{ textAlign: "center" }}>
            <textarea className={`form-control ${props.error ? "is-invalid" : ""}`} {...textAreaProps}></textarea>
            <label htmlFor={props.id} className="form-label"><i className={`fa fa-${props.icon}`}></i> {props.label}</label>
        </div>
    </>
});

export const InputForm = React.memo(function ({ type, name, id, icon, error, placeholder }) {
    return <>
        <div className="mb-3 mx-auto" >
            <div className={`${icon && "input-group"} text-light`} style={{ textAlign: "center" }}>
                <input type={type} className={`form-control ${error ? "is-invalid" : ""}`} name={name} id={id}
                    placeholder={placeholder} autoComplete="autoComplete" required />

                {icon && <span className={`input-group-text`}>
                    <i className={`fa fa-${icon}`} style={{ color: "#00ccc1" }}></i>
                </span>}

                {error &&
                    <div className="invalid-feedback">{error}</div>
                }
            </div>
        </div>
    </>
});

export const Button = React.memo(function (props) {

    const { loading, icon, children } = props;

    let buttonProps = React.useMemo(() => { return {} }, []);

    for (let prop in props) {
        switch (prop) {
            case "loading":
                buttonProps = { ...buttonProps, disabled: Boolean(props[prop]) }
                break;

            case "variant":
                buttonProps = { ...buttonProps, className: `btn btn-${props[prop]}` }
                break;

            case "icon":
                break;

            case "childDNone":
                break;

            default:
                buttonProps = { ...buttonProps, [prop]: props[prop] }
                break;
        }
    }

    return <>
        <button {...buttonProps}>
            {icon && <span className="align-self-center">
                <i className={`fa fa-${icon}`}></i>
            </span>}
            <span className={`${props.childDNone ? 'd-none d-sm-block' : ''} align-self-center ms-1`}>{children}</span>
            {loading &&
                <span className="spinner-border spinner-border-sm align-self-center ms-1"></span>}
        </button>
    </>
});

export const DisplayImage = React.memo(({ imageName, borderClass, containerClass }) => {
    const { screenWidth } = React.useContext(AppContext);
    const { sizes, description, format } = imagesData[imageName];

    const defaultSize = sizes[sizes.length - 1];
    const size =
        screenWidth < 300
            ? sizes[0] || defaultSize
            : screenWidth < 350
                ? sizes[1] || defaultSize
                : screenWidth < 576
                    ? sizes[2] || defaultSize
                    : screenWidth < 768
                        ? sizes[3] || defaultSize
                        : screenWidth < 992
                            ? sizes[4] || defaultSize
                            : sizes[5] || defaultSize;

    const [imageIsLoaded, setImageIsLoaded] = React.useState(false);

    const handleDisplayImage = React.useCallback(function () {
        setImageIsLoaded(true);
    }, []);

    const imageSrc = `${process.env.PUBLIC_URL}/storage/images/${imageName}/${size}.${format}`;

    return <>
        <img
            width={size}
            height={size}
            alt={description}
            src={imageSrc}
            style={{ display: imageIsLoaded ? "block" : "none" }}
            className={`img-fluid ${borderClass || ""} ${containerClass || ""}`}
            onLoad={handleDisplayImage}
        />

        {!imageIsLoaded &&
            <div className="ratio ratio-1x1 rounded" style={{ width: `${size}px`, backgroundColor: "#1f1f1f" }}>
                <div className="d-flex justify-content-center">
                    <span className="align-self-center">
                        <i className="fas fa-circle-notch fa-spin text-light"></i>
                    </span>
                </div>
            </div>
        }
    </>
});

export const DisplayCategory = React.memo(function ({ category, percentage, amount, handleCurrentCategory, withHelp }) {

    const { name, icon } = category;
    const { t } = useTranslation();

    return <>
        <div className="card">
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <div className="align-self-center">
                        <p className="card-text">{name}</p>
                        {!isNaN(amount) &&
                            <>
                                <h4 className="card-title"><AmountDisplayer amount={amount} /></h4>
                            </>}
                    </div>
                    <div>
                        {withHelp &&
                            <HelpPopover
                                number={7}
                                type="button"
                                title={t('help_set_category_budget')}
                                content={t('help_set_category_budget_description')}
                                className="btn">
                                <i className={`fa fa-${icon}`}></i>
                            </HelpPopover>}

                        {(!withHelp && handleCurrentCategory) &&
                            <button type="button" className={`btn`} style={{ backgroundColor: "#e7e9eb" }}
                                data-bs-toggle="modal" data-bs-target="#budgetCategoryModal"
                                onClick={() => { handleCurrentCategory(category) }}>
                                <i className={`fa fa-${icon}`}></i>
                            </button>}

                        {!handleCurrentCategory &&
                            <button type="button" className={`btn`} style={{ backgroundColor: "#e7e9eb" }}>
                                <i className={`fa fa-${icon}`}></i>
                            </button>}
                    </div>
                </div>
            </div>
            {
                !isNaN(percentage) && <>
                    <div className="card-footer">
                        <small className={`text-dark`}>{percentage}%</small>
                        <div className="progress">
                            <div className={`progress-bar`} style={{ width: `${percentage}%`, backgroundColor: "#846bae" }}></div>
                        </div>
                    </div>
                </>
            }
        </div>
    </>
});

export const FloatingButton = React.memo((props) => {

    const rightPosition = useButtonRightPosition();
    const ref = React.useRef();

    const buttonStyle = React.useMemo(() => ({
        position: "fixed",
        bottom: "80px",
        right: rightPosition,
        zIndex: 100
    }), [rightPosition]);

    useModalToggleObserver(ref, props.toggler)

    return (
        <button
            type="button"
            style={buttonStyle}
            className="btn" {...props}
            ref={ref}>
            <i className="fa fa-plus-circle fa-3x text-danger"></i>
        </button>
    )
});