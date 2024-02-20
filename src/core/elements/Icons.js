import React from 'react';
import backend from '../../api/functions/backend';
import useObserver from '../hooks/useObserver';
import { useTranslation } from 'react-i18next';

const Icons = React.memo(function ({ parent, icon }) {
    const [icons, setIcons] = React.useState(null);

    const {t} = useTranslation();
    const iconsModalRef = React.useRef();

    const fetchIcons = React.useCallback(() => {
        if (!icons) {
            backend('/icons/get')
                .then(response => {
                    if (response.data.icons) {
                        setIcons(response.data.icons);
                    }
                });
        }
    }, [icons]);

    const handleIconSelect = React.useCallback(function (e) {
        icon.set(e.currentTarget.id);
    }, [icon]);

    useObserver('class', iconsModalRef, 'show', fetchIcons);

    return <>
        <div className="modal fade" id="iconsModal" tabIndex="-1" data-bs-keyboard="false" role="dialog"
            aria-labelledby={`ft${parent}`} aria-hidden="true" ref={iconsModalRef}>
            <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className='d-flex flex-column'>
                            <h5 className="modal-title" id={`ft${parent}`}><i className='fa fa-smile'></i> {t('choose_icon')}</h5>
                            <small className='text-secondary'>{t('choose_icon_description')}</small>
                        </div>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className='d-flex flex-wrap justify-content-center'>
                            {icons && icons.map((item, key) => {
                                return <div key={key} className='col-1 mx-2 mx-sm-1'>
                                    <button className={`btn ${item === icon.value ? 'btn-success' : ''}`} id={item} onClick={handleIconSelect} >
                                        <i className={`fa fa-${item}`} ></i>
                                    </button>
                                </div>
                            })}

                            {!icons && <div className='spinner-border spinner-border-lg'></div>}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary"
                            data-bs-target={`#${parent}`} data-bs-toggle="modal"><i className='fa fa-check'></i> done</button>
                    </div>
                </div>
            </div>
        </div>
    </>
});

export default Icons;