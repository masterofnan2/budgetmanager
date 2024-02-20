import React from "react";
import { Button, DisplayEmpty } from "../../../minitatures";
import useObserver from "../../../../hooks/useObserver";
import backend from "../../../../../api/functions/backend";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Notifications = React.memo(function ({ openNotification }) {
    const [component, setComponent] = React.useState({
        consumerNotifications: null,
        offset: 0,
        loading: false
    });

    const { consumerNotifications, offset } = component;
    const notificationsModalRef = React.useRef();
    const closeNotificationsRef = React.useRef();

    const navigate = useNavigate();
    const { t } = useTranslation();

    const fetchNotifications = React.useCallback(() => {
        if (!consumerNotifications || consumerNotifications.length <= 3) {
            backend("/notifications/get?limit=3")
                .then(response => {
                    setComponent(C => {
                        return { ...C, consumerNotifications: response.data?.consumerNotifications, offset: 0 }
                    })
                });
        }
    }, [consumerNotifications]);

    const handleAction = React.useCallback((action, consumerNotification) => {
        if (!parseInt(consumerNotification.seen)) {
            backend('/notifications/open?id=' + consumerNotification.id)
                .then(response => {
                    response.data?.success && openNotification();
                });
        }
        closeNotificationsRef.current.click();
        navigate(action);
    }, [navigate, openNotification]);

    const showMore = React.useCallback(() => {
        if (consumerNotifications.length >= 3) {
            setComponent(C => {
                return { ...C, loading: true };
            });

            const newOffset = offset + 3;

            backend(`/notifications/get?limit=3&offset=${newOffset}`)
                .then(response => {
                    if (response.data?.consumerNotifications) {
                        setComponent(C => {
                            return {
                                ...C, consumerNotifications: C.consumerNotifications.concat(response.data.consumerNotifications)
                                , loading: false, offset: newOffset
                            };
                        });
                    };
                });
        }
    }, [offset, consumerNotifications]);

    useObserver('class', notificationsModalRef, 'show', fetchNotifications);

    return <div className="modal fade" id="notificationsModal"
        tabIndex="-1" role="dialog" aria-labelledby="notificationsModalTitle"
        aria-hidden="true" ref={notificationsModalRef}>
        <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="notificationsModalTitle"><i className="fa fa-bell"></i> {t('notifications')}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        ref={closeNotificationsRef}></button>
                </div>
                <div className="modal-body">
                    <div className="d-flex justify-content-center">
                        {!consumerNotifications && <div>
                            <span className="spinner-border spinner-border-lg"></span>
                        </div>}

                        {consumerNotifications?.length > 0 && <>
                            <ul className="list-group list-group-flush col-12">
                                {consumerNotifications.map(consumerNotification => {
                                    const { id, notification } = consumerNotification;
                                    const { type, title, content, action } = notification;

                                    const seen = parseInt(consumerNotification.seen);

                                    return <li key={id}
                                        className={`list-group-item list-group-item-action ${seen ? '' : `list-group-item-${type}`} rounded mb-2`}
                                        type="button" onClick={() => { handleAction(action, consumerNotification) }}>
                                        <div className="d-flex flex-column">
                                            <div className="d-flex justify-content-between">
                                                <div>{title}</div>
                                                {!seen &&
                                                    <span className={`text-${type} align-self-start`}><i className="fa fa-circle"></i></span>}
                                            </div>
                                            <small>{content}</small>
                                        </div>
                                    </li>
                                })}
                            </ul>
                        </>
                        }

                        {consumerNotifications?.length === 0 &&
                            <div className="col-12">
                                <DisplayEmpty size="md" />
                            </div>}
                    </div>
                    {consumerNotifications?.length >= 3 && <div className="d-flex justify-content-center border-top p-2">
                        <Button type='button' variant={"success col-8"}
                            onClick={showMore} loading={component.loading}>{t('see_more')}</Button>
                    </div>}
                </div>
            </div>
        </div>
    </div>
});

export default Notifications;