import React from "react";
import { AppContext } from "../../../../App";
import { Link } from "react-router-dom";
import { ChangeLanguageForm, DisplayImage } from "../../minitatures";
import backend from "../../../../api/functions/backend";
import RouteLinks from "./partials/RouteLinks";
import Notifications from "./partials/Notifications";
import { useOffcanvasWidth } from "../../../hooks/useOffcanvasWidth";
import HelpButton from "./partials/HelpButton";

const Offcanvas = React.memo(() => {
    const { screenWidth, AuthContext, websocket } = React.useContext(AppContext);
    const [component, setComponent] = React.useState({
        unseenNotifications: 0
    });

    const { unseenNotifications } = component;

    const offcanvasWidth = useOffcanvasWidth();

    const getUnseen = React.useCallback(() => {
        backend('/notifications/unseen')
            .then(response => {
                if (response.data?.unseen) {
                    setComponent(C => {
                        return { ...C, unseenNotifications: response.data.unseen };
                    });
                };
            });
    }, []);

    const openNotification = React.useCallback(() => {
        setComponent(C => {
            return { ...C, unseenNotifications: --C.unseenNotifications };
        })
    }, []);

    React.useEffect(() => {
        if (AuthContext.state) {
            getUnseen();
        } else {
            setComponent(C => {
                return { ...C, unseenNotifications: 0 };
            });
        }
    }, [AuthContext.state, getUnseen]);

    React.useEffect(() => {
        if (websocket.channel) {
            websocket.channel.bind('bm-notification-event', getUnseen);
        }
    }, [websocket.channel, getUnseen]);

    return <>
        <div className={`offcanvas offcanvas-end ${screenWidth >= 992 ? "show" : ""}`}
            data-bs-scroll="true" tabIndex="-1" id="offcanvasNavbar" style={{ width: offcanvasWidth }}>
            <div className="offcanvas-header bg-dark">
                <div className="w-100 p-1 d-flex flex-column">
                    {
                        (screenWidth < 992) && <div data-bs-dismiss="offcanvas">
                            <button
                                className="btn float-end shadow-sm"
                                style={{ color: "#bbb", fontSize: "20px" }}
                                id="closeOffcanvasButton"><i className="fa fa-times" ></i></button>
                        </div>
                    }

                    <div className="d-flex justify-content-center mb-2">
                        <DisplayImage imageName="project_management" />
                        <div className="ms-2 d-flex">
                            <div>
                                <i className="fa fa-bold text-light"></i>
                            </div>
                            <div>
                                <Link to="/" className="text-decoration-none" style={{ color: "#bbb" }}>udgetManager</Link>
                            </div>
                        </div>
                    </div>

                    {AuthContext.state &&
                        <div className="d-flex justify-content-center rounded p-1"
                            style={{ backgroundColor: "#313539" }} data-bs-dismiss={screenWidth >= 992 ? "" : "offcanvas"}>
                            <div className="mx-1"
                                data-bs-toggle="tooltip"
                                title={`${unseenNotifications} new notification${unseenNotifications > 1 ? 's' : ''}`}>
                                <button type="button" className={`btn btn-outline-${unseenNotifications > 0 ? 'warning' : 'secondary'} btn-sm`}
                                    data-bs-toggle="modal" data-bs-target="#notificationsModal">
                                    <span className="fa-layers fa-fw">
                                        <i className="fa fa-bell"></i> {unseenNotifications > 0 &&
                                            <span className="fa-layers-counter">{unseenNotifications}</span>}
                                    </span>
                                </button>
                            </div>
                            <HelpButton />
                        </div>}
                    {!AuthContext.state &&
                        <ChangeLanguageForm size="sm" />}
                </div>
            </div>
            <div className="offcanvas-body bg-dark">
                <div className="d-flex flex-column align-items-center" style={{ textAlign: "center" }}>
                    <RouteLinks />
                </div>
            </div>
        </div>
        <Notifications openNotification={openNotification} />
    </>
});

export default Offcanvas;