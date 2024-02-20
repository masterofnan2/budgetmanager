import { Modal } from "bootstrap";
import React from "react";

const useModal = (modalId, closestRef) => {
    const [modalElement, setModalElement] = React.useState(null);

    React.useEffect(() => {
        if (closestRef.current) {
            const currentModal = document.getElementById(modalId);
            if (currentModal) {
                setModalElement(new Modal(currentModal));
            }
        }
    }, [closestRef, modalId]);

    return modalElement;
}

export default useModal;