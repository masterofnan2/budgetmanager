import React from "react";
import backend from "../../api/functions/backend";
import { useRedirect } from "../../core/hooks/useRedirect";
import { AppContext } from "../../App";
import SetBudget from "./partials/SetBudget";
import CategoriesBudget from "./partials/CategoriesBudget";

export const budgetDefault = {
    render: 0,
    budget: null,
    setBudget: () => { },
    reRender: () => { }
}

export const budgetContext = React.createContext(budgetDefault);

const Budget = React.memo(function () {

    const {AuthContext} = React.useContext(AppContext);
    const {state} = AuthContext;

    useRedirect(state, true);

    const [component, setComponent] = React.useState({
        render: 0,
        budget: {}
    });

    const setBudget = React.useCallback(function (budget) {
        setComponent(C => {
            return { ...C, budget: budget };
        })
    }, []);

    const { budget, render } = component;

    React.useEffect(() => {
        if (state) {
            backend('/budget/get')
                .then(response => {
                    const { budget } = response.data || {};
                    if (budget) {
                        setBudget(budget)
                    }
                })
        }
    }, [render, setBudget, state]);

    const handleRender = React.useCallback(function () {
        setComponent(C => {
            return { ...C, render: ++C.render };
        })
    }, []);
    
    if (state && budget?.amount) {
        return <>
            <budgetContext.Provider value={{ ...budgetDefault, budget, setBudget, reRender: handleRender }}>
                <div className="container-fluid my-2 mt-4">
                    <div className="col-lg-10 col">
                        <div className="d-flex align-items-center flex-wrap">
                            <SetBudget />
                            <CategoriesBudget render={render} />
                        </div>
                    </div>
                </div>
            </budgetContext.Provider>
        </>
    }
});

export default Budget;