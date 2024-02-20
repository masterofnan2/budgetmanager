import React from "react";
import { useOffcanvasWidth } from "./useOffcanvasWidth";
import { AppContext } from "../../App";

const useButtonRightPosition = () => {
    const { screenWidth } = React.useContext(AppContext);
    const offcanvasWidth = useOffcanvasWidth();

    const rightPosition = React.useMemo(() => {
        if (screenWidth > 992) {
            const value = parseFloat(offcanvasWidth) + 1;
            return value + "%";
        }
        return "10px";
    }, [screenWidth, offcanvasWidth]);

    return rightPosition;
}

export default useButtonRightPosition;