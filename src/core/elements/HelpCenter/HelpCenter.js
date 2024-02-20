import React from "react";
import { AppContext } from "../../../App";
import NavigationButton from "./partials/NavigationButton";
import { useLocation, useNavigate } from "react-router-dom";
import availableHelps from "./availableHelps";
import { Offcanvas } from "bootstrap";
import ProgressBar from "./partials/ProgressBar";
import { useTranslation } from "react-i18next";

const HelpCenter = React.memo(() => {
    const { HelpContext, screenWidth } = React.useContext(AppContext);

    const { target, state, setHelp } = HelpContext;
    const location = useLocation();
    const navigate = useNavigate();

    const {t} = useTranslation();

    React.useEffect(() => {
        if (state && target) {
            const targetCount = target.count;
            const targetCurrent = target.current;

            if (targetCurrent > targetCount) {
                setHelp({
                    state: false,
                    target: null
                });

                const help = new URLSearchParams(location.search).get('help');
                if (help) {
                    navigate(location.pathname);
                }
            }
        }
    }, [state, target, setHelp, location.pathname, location.search, navigate]);

    React.useEffect(() => {
        if (!HelpContext.state) {
            const help = new URLSearchParams(location.search).get('help');
            if (help && availableHelps[location.pathname]) {
                HelpContext.setHelp({
                    state: true,
                    target: {
                        current: 1,
                        count: availableHelps[location.pathname]
                    }
                })
            }
        }
    }, [location.pathname, HelpContext, location.search]);

    const IncrementCurrent = React.useCallback(() => {
        let timeout = 0;

        if (screenWidth < 992 && target.current === (target.count - 1)) {
            const offcanvas = new Offcanvas(document.getElementById('offcanvasNavbar'))
            offcanvas.show();
            timeout = 250;
        }

        setTimeout(() => {
            setHelp({
                ...HelpContext,
                target: {
                    ...HelpContext.target,
                    current: ++target.current
                }
            })
        }, timeout);

    }, [setHelp, HelpContext, target, screenWidth]);

    const DecrementCurrent = React.useCallback(() => {
        let timeout = 250;

        if (screenWidth < 992 && target.current === target.count) {
            const closeOffcanvasButton = document.getElementById('closeOffcanvasButton')
            closeOffcanvasButton.click();
            timeout = 250;
        }

        setTimeout(() => {
            if (target.current > 1) {
                setHelp({
                    ...HelpContext,
                    target: {
                        ...HelpContext.target,
                        current: --target.current
                    }
                })
            }
        }, timeout);
    }, [HelpContext, setHelp, target, screenWidth]);

    if (state) {
        return <>
            <ProgressBar />

            <NavigationButton
                position="left"
                icon="arrow-left"
                variant="warning"
                onClick={() => DecrementCurrent()}
                disabled={target.current <= 1}>
                {t('previous')}
            </NavigationButton>

            <NavigationButton
                position="right"
                icon="arrow-right"
                variant="warning"
                onClick={() => IncrementCurrent()}>
                {t('next')}
            </NavigationButton>

            <div className="modal-backdrop fade show"></div>
        </>
    }
});

export default HelpCenter;