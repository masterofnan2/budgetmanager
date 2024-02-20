import React from "react";
import { AppContext } from "../../App";
import { setSession } from "../../core/function/setSession";


const useWsSession = function () {
    const { websocket, AuthContext } = React.useContext(AppContext);
    const handleWsSession = React.useCallback(() => {
        setSession(AuthContext);
    }, [AuthContext]);

    React.useEffect(() => {
        if (AuthContext.state && websocket.channel) {
            websocket.channel.bind('bm-session-event', handleWsSession);
        }
    }, [AuthContext.state, websocket.channel, handleWsSession]);
}

export default useWsSession;