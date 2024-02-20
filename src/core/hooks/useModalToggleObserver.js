import React from "react";
import { useLocation } from "react-router-dom";

const useModalToggleObserver = (ref, toggler) => {
    const location = useLocation();

    React.useEffect(() => {
        if (toggler) {
            const params = new URLSearchParams(location.search);
            if (params.get(toggler) && ref.current) {
                setTimeout(() => ref.current.click(), 100);
            }
        }
        return clearTimeout();
    }, [location.search, ref, toggler]);
}

export default useModalToggleObserver;