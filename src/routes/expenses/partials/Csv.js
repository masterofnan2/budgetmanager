import React from "react";
import { Button, FloatingInputForm } from "../../../core/elements/minitatures";
import { CSVDownload } from "react-csv";
import { AppContext } from "../../../App";
import { useTranslation } from "react-i18next";
import HelpPopover from "../../../core/elements/HelpCenter/partials/HelpPopover";

const Csv = React.memo(({ data }) => {
    const [filename, setFilename] = React.useState(null);

    const { AuthContext, HelpContext } = React.useContext(AppContext);
    const { currency } = AuthContext.settings;

    const closeModalRef = React.useRef();
    const { t } = useTranslation();

    const headers = React.useMemo(() => {
        return [
            {
                label: `Amount (${currency.name})`,
                key: "amount"
            },
            {
                label: "Category",
                key: "category.name"
            },
            {
                label: "Description",
                key: "description"
            },
            {
                label: "Date",
                key: "date"
            }
        ]
    }, [currency.name]);

    const handleSubmit = React.useCallback(e => {
        e.preventDefault();

        const numberOfTargets = 3;
        let name = null;
        for (let i = 0; i < numberOfTargets; i++) {
            if (e.target[i].name === "filename") {
                name = e.target[i].value;
                if (!name.includes(".csv")) {
                    name += ".csv";
                }
            }
        }

        setFilename(name || "expenses.csv");
        if (closeModalRef.current) {
            setTimeout(() => {
                closeModalRef.current.click();
            }, 1000);
        }
    }, [closeModalRef]);

    return <>
        <div className="d-flex justify-content-around flex-wrap p-3 rounded" style={{ backgroundColor: "#e7e7e7" }}>
            <div>
                <h5>{t('export_data')}</h5>
                <small>{t('export_data_description')}</small>
            </div>
            <div className="align-self-center">

                <Button
                    variant="dark"
                    icon="arrow-alt-circle-right"
                    data-bs-toggle="modal"
                    data-bs-target="#csvModal">{t('export')}</Button>
                    
                {HelpContext.state &&
                    <HelpPopover
                        type="button"
                        number={3}
                        className="btn"
                        title={t('export_data')}
                        content={t('export_data_description')} />}
            </div>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="modal fade" id="csvModal" tabIndex="-1" role="dialog" aria-labelledby="csvModalTitle" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="csvModalTitle"><i className="fa fa-file"></i> {t('export_to_csv')}</h5>
                            <button type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                ref={closeModalRef}></button>
                        </div>
                        <div className="modal-body">
                            <div className="container-fluid">
                                <p className="alert alert-info my-3">{t('allow_popups')}</p>

                                <FloatingInputForm
                                    type="text"
                                    name="filename"
                                    id="csvNameInput"
                                    label="filename"
                                    defaultValue="expenses.csv"
                                    icon="file" />

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary"><i className="fa fa-download"></i> {t('download')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
        {filename &&
            <CSVDownload
                data={data}
                headers={headers}
                filename={filename} />}
    </>
});

export default Csv;