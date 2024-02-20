import React from "react";
import { AppContext } from "../../../App";
import { Button, FloatingInputForm, FloatingTextAreaForm } from "../../../core/elements/minitatures";
import backend from "../../../api/functions/backend";
import Icons from "../../../core/elements/Icons";
import { useTranslation } from "react-i18next";

const CategoryModal = React.memo(function ({ currentCategory, reRender, handleCurrentCategory }) {
    const categoryDataDefault = React.useMemo(() => {
        return {
            id: null,
            name: '',
            icon: 'smile',
            description: ''
        }
    }, []);

    const [component, setComponent] = React.useState({
        submitLoading: false,
        errors: null,
        categoryData: categoryDataDefault
    });

    const { submitLoading, errors, categoryData } = component;

    const { ToastContext } = React.useContext(AppContext);
    const { showToast } = ToastContext;

    const { t } = useTranslation();
    const closeModalRef = React.useRef();

    React.useEffect(() => {
        setComponent(C => {
            return { ...C, categoryData: currentCategory || categoryDataDefault };
        })
    }, [currentCategory, categoryDataDefault]);

    const handleCategoryChange = React.useCallback(function (e) {
        setComponent(C => {
            if (e.target.id.includes('name')) {
                return { ...C, categoryData: { ...C.categoryData, name: e.target.value } };
            }
            if (e.target.id.includes('description')) {
                return { ...C, categoryData: { ...C.categoryData, description: e.target.value } };
            }
        })
    }, []);

    const handleSelectedIcon = React.useCallback(function (icon) {
        setComponent(C => {
            return { ...C, categoryData: { ...C.categoryData, icon } };
        })
    }, []);

    const handleSubmit = React.useCallback(function (e) {
        e.preventDefault();

        setComponent(C => {
            return { ...C, submitLoading: true };
        });

        backend(`/categories/${currentCategory ? 'update' : 'create'}`, categoryData, "POST")
            .then(Response => {
                if (Response.data?.category) {
                    closeModalRef.current.click();
                    
                    showToast({
                        icon: "check-circle",
                        title: "success",
                        body: currentCategory ?
                            "Modifications saved successfully" :
                            "Category created successfuly"
                    });
                    handleCurrentCategory(Response.data.category);

                    reRender();
                }

                setComponent(C => {
                    return { ...C, submitLoading: false, errors: Response.errors };
                });
            })
    }, [categoryData, showToast, reRender, currentCategory, handleCurrentCategory]);

    return <>
        <form className="modal fade" id="categoryModal" tabIndex="-1"
            data-bs-keyboard="false" role="dialog" aria-labelledby="categoryModalTitle"
            aria-hidden="true" onSubmit={handleSubmit}>
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="categoryModalTitle"><i className="fa fa-pencil-alt"></i> {t('customize')}</h5>
                        <button
                            type="button" className="btn-close"
                            aria-label="Close" data-bs-dismiss="modal"
                            ref={closeModalRef}></button>
                    </div>
                    <div className="modal-body">
                        <div className="p-3">
                            <div className="mb-3">
                                <FloatingInputForm type="text" id={`category-name`} label={t('category_name')} icon={"stream"}
                                    value={categoryData.name} onChange={handleCategoryChange}
                                    placeholder={'name_your_category'}
                                    error={errors?.name || null} />
                            </div>
                            <div className="mb-3">
                                <FloatingTextAreaForm id="category-description" rows="auto"
                                    value={categoryData.description} icon={"paragraph"}
                                    label={t('category_description')} onChange={handleCategoryChange}
                                    placeholder={t('describe_category')}
                                    error={errors?.description || null} />
                            </div>
                            <div className="mb-3" style={{ textAlign: "center" }}>
                                <div className="input-group" data-bs-target="#iconsModal" data-bs-toggle="modal">
                                    <span className="input-group-text" >
                                        <i className={`fa fa-${categoryData.icon}`}></i>
                                    </span>
                                    <input type="button" className={`form-control ${errors?.icon ? 'is-invalid' : ''}`}
                                        placeholder={t('choose_icon')} value={categoryData.icon} />

                                    {errors?.icon && <div className="invalid-feedback">{errors.icon}</div>}
                                </div>
                                <small className="text-success">{t("choose_icon_description")}</small>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        {currentCategory &&
                            <button type="button" className="btn btn-danger btn-sm"
                                data-bs-target="#deleteDialogModal" data-bs-toggle="modal"><i className="fa fa-trash"></i> {t('delete')}</button>
                        }
                        <Button type="submit" className="btn btn-primary col-md-4" loading={submitLoading}><i className="fa fa-save" ></i> {t('save')}</Button>
                    </div>
                </div>
            </div>
        </form>
        <Icons parent={`categoryModal`} icon={{ value: categoryData.icon, set: handleSelectedIcon }} />
    </>
});

export default CategoryModal;