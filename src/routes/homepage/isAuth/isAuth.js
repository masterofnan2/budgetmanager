import React from "react";
import Balance from "./partials/Balance";
import OverView from "./partials/OverView";
import Expenses from "./partials/Expenses";
import RegisterExpense from "./partials/RegisterExpense";
import Categories from "./partials/Categories";

export const HomepageRenderContext = React.createContext({});

const IsAuth = React.memo(function () {
    const [component, setComponent] = React.useState({
        render: 0
    })

    const { render } = component;

    const reRender = React.useCallback(() => {
        setComponent(C => {
            return { ...C, render: ++C.render };
        })
    }, []);

    return <>
        <HomepageRenderContext.Provider value={{ render, reRender }}>
            <div className="container-fluid">
                <div className="d-flex justify-content-around flex-wrap">
                    <div className="rounded p-3 col-12 col-md-5 align-self-center" style={{ backgroundColor: "#846bae" }}>
                        <Balance />
                    </div>
                    <OverView />
                    <div className="rounded shadow col-md-3 col col-sm-6 p-3 align-self-center mt-3 mt-md-0 "
                        style={{ backgroundColor: "rgb(231, 233, 235)", textAlign: "center" }} type="button">
                        <RegisterExpense />
                    </div>
                    <div className="rounded p-3 col-12 col-sm-5 col-md-3 col align-self-center mt-2 mt-md-0 border border-dark" type="button">
                        <Expenses />
                    </div>
                    <div className="rounded shadow col-md-8 col-sm-6 col-12 mt-3 align-self-center" style={{ maxHeight: "267px", overflow: "auto" }}>
                        <Categories />
                    </div>
                </div>
            </div>
        </HomepageRenderContext.Provider>
    </>
});

export default IsAuth;