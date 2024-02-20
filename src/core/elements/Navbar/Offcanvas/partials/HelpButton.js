import React from "react";
import { AppContext } from "../../../../../App";
import { useLocation } from "react-router-dom";
import availableHelps from "../../../HelpCenter/availableHelps";
import HelpPopover from "../../../HelpCenter/partials/HelpPopover";
import { useTranslation } from "react-i18next";

const HelpButton = React.memo(() => {
    const { HelpContext, AuthContext } = React.useContext(AppContext);

    const location = useLocation();
    const { t } = useTranslation();

    const helpIsAvailable = React.useMemo(() => (
        availableHelps[location.pathname] && AuthContext.state
    ), [location.pathname, AuthContext.state])

    const handleHelp = React.useCallback(() => {
        if (helpIsAvailable && !HelpContext.state) {
            HelpContext.setHelp({
                state: !HelpContext.state,
                target: {
                    count: availableHelps[location.pathname],
                    current: 1
                },
            })
        }
    }, [location.pathname, HelpContext, helpIsAvailable])

    React.useEffect(() => {
        if (!availableHelps[location.pathname] && HelpContext.state) {
            HelpContext.setHelp({
                state: false,
                target: null
            });
        }
    }, [location.pathname, HelpContext]);

    return <HelpPopover
        number={HelpContext.state ? HelpContext.target.count : 0}
        data-bs-placement="bottom"
        type="button"
        title={t('click_to_help')}
        content={t('click_to_help_description')}

        className={`btn ${helpIsAvailable ? 'btn-outline-warning' : 'btn-outline-secondary'} btn-sm`}
        onClick={() => handleHelp()}>
        <i className="fa fa-question"></i>
    </HelpPopover>
});

export default HelpButton;