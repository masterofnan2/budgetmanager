import React from "react";
import { AppContext } from "../../App";

export const offCanvasBreakpoints = {
    300: '100%',
    350: '75%',
    576: '50%',
    768: '33.33%',
    992: '25%',
    default: '16.66%'
};

export const useOffcanvasWidth = () => {
    const { screenWidth } = React.useContext(AppContext);

    const offcanvasWidth = React.useMemo(() => {
        const screenSizes = Object.keys(offCanvasBreakpoints);
        let lastOffcanvasWidth = null;

        for (let i = screenSizes.length - 2; i >= 0; i--) {
            if (screenWidth < screenSizes[i]) {
                lastOffcanvasWidth = offCanvasBreakpoints[screenSizes[i]]
            }
        }

        return lastOffcanvasWidth || offCanvasBreakpoints.default
    }, [screenWidth]);

    return offcanvasWidth;
}