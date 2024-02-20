import React from "react"
import { AppContext } from "../../../../App";
import { Popover } from "bootstrap";

const HelpPopover = React.memo((props) => {

    const [popover, setPopover] = React.useState(null);

    const { HelpContext } = React.useContext(AppContext);
    const { target, state } = HelpContext;

    const { children } = props;
    const externalProps = React.useMemo(() => ['title', 'content', 'data-bs-content' ,'children', 'number', 'data-bs-placement', 'ref'], []);

    const buttonProps = React.useMemo(() => {
        const temp = { ...props };

        externalProps.forEach(externalProp => {
            temp[externalProp] && delete temp[externalProp];
        });

        return temp;
    }, [externalProps, props]);

    const popoverRef = React.useRef();

    const popoverProps = React.useMemo(() => {
        let temp = { ...props, ref: popoverRef, 'data-bs-content': props.content };

        for(let propName in temp){
            if(!externalProps.includes(propName) || propName === "number" || propName === "content"){
                delete temp[propName];
            }
        }

        return temp;
    }, [externalProps, props]);

    React.useEffect(() => {
        if (popoverRef.current) {
            const temp = new Popover(popoverRef.current);
            temp.disable();

            setPopover(temp);
        }
    }, [popoverRef]);

    React.useEffect(() => {
        if (state && target?.current === parseInt(props.number)) {
            popover?.enable();
            popover?.show();
        } else {
            popover?.hide();
            popover?.disable();
        }
    }, [state, props.number, target, popover])

    return <>
        {props.type === "button" &&
            <button {...buttonProps}
                {...popoverProps}>
                {children}
            </button>}

        {props.type === "floatingInput" &&
            <div className="form-floating"
                {...popoverProps}>
                <input
                    type="text"
                    id={`popoverExample${props.number}`}
                    className="form-control"
                    placeholder={props.placeholder}
                    defaultValue={props.value} />

                <label htmlFor={`popoverExample${props.number}`}>
                    <i className={`fa fa-${props.icon}`}></i> {props.label}
                </label>
            </div>}

        {props.type === "floatingSelect" &&
            <div className="form-floating"
                {...popoverProps}>
                <select id={`popoverSelect${props.number}`} className="form-select">
                    {props.options.map((option, key) => <option value={option.id} key={key}>{option.name}</option>)}
                </select>
                <label htmlFor={`popoverSelect${props.number}`}>
                    <i className={`fa fa-${props.icon}`}></i>{props.label}</label>
            </div>}
    </>
});

export default HelpPopover;