import React from "react";
import useButtonRightPosition from "../../../hooks/useButtonRightPosition";
import { Button } from "../../minitatures";

const NavigationButton = React.memo((props) => {

    const externalProps = React.useMemo(() => ['bottom', 'position', 'children'], []);
    const rightPosition = useButtonRightPosition();

    let newProps = React.useMemo(() => {
        const temp = { ...props };
        externalProps.forEach(externalProp => {
            temp[externalProp] && delete temp[externalProp];
        })

        return temp;
    }, [props, externalProps]);

    const buttonStyle = React.useMemo(() => {
        let temp = {
            position: "fixed",
            top: props.bottom || '30px',
            zIndex: 1100
        }

        temp = props.position === "left" ? { ...temp, left: "10px" } : { ...temp, right: rightPosition };
        return temp;
    }, [props, rightPosition])

    if (props.position === "left") {
        return <Button style={buttonStyle} {...newProps}>
            {props.children}
        </Button>
    } else {
        return <button
            className={`btn btn-${props.variant}`}
            type={props.type}
            style={buttonStyle}
            onClick={props.onClick}>
            {props.children} <i className={`fa fa-${props.icon}`}></i>
        </button>
    }
})

export default NavigationButton;