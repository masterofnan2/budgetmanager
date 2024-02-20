import pusherJs from "pusher-js";

const APP_KEY = 'c97985bd23ed4a081ca8';

export const getInstance = function () {
    const pusher = new pusherJs(APP_KEY, {
        encrypted: true,
        cluster: 'ap2'
    });

    return pusher;
}


export const getChannel = function () {
    const channel = getInstance().subscribe(process.env.REACT_APP_WEBSOCKET_CHANNEL + localStorage.getItem('token'));
    return channel;
}