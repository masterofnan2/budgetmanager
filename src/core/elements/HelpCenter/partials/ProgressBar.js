import React from "react";
import { AppContext } from "../../../../App";

const ProgressBar = React.memo(() => {
    const { HelpContext } = React.useContext(AppContext);

    const width = React.useMemo(() => {
        const temp = Math.ceil(HelpContext.target.current * 100 / HelpContext.target.count);
        return temp;
    }, [HelpContext]);

    return <>
        <div style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "30px",
            zIndex: 1100
        }} className="col-10 col-sm-8 col-md-5">
            <div className="progress">
                <div className="progress-bar bg-info"
                    role="progressbar"
                    style={{ width: `${width}%` }}></div>
            </div>
        </div>
    </>
});

export default ProgressBar;