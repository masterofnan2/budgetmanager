import React from "react";

const useObserver = function (attributeName, ref, attributeValue, callback = () => { }) {
    React.useEffect(() => {
        let timeout;
        if (ref.current) {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === "attributes" && mutation.attributeName === attributeName) {
                        const currentValue = ref.current.classList.value;
                        if (currentValue.includes(attributeValue)) {
                            clearTimeout(timeout);
                            timeout = setTimeout(callback, 50);
                        };
                    };
                };
            });

            const options = {
                attributes: true,
                attributeFilter: ['class']
            };

            observer.observe(ref.current, options);

            return () => {
                observer.disconnect();
                clearTimeout(timeout);
            };
        }
    }, [attributeName, attributeValue, callback, ref]);
};

export default useObserver;
