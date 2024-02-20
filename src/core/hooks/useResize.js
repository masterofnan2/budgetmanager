import React from "react";

export default function useResize() {
    const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
    const delay = 250;

    const updateScreenWidth = React.useCallback(function () {
        setScreenWidth(window.innerWidth);
    }, []);

    React.useEffect(function () {
        let timeout;

        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(updateScreenWidth, delay);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeout);
        };
    }, [updateScreenWidth, delay]);

    return screenWidth;
}