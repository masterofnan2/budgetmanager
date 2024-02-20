import React from "react";
import { CycleForm, DeleteDialogModal, FloatingButton, SpinnerDisplayer } from "../../core/elements/minitatures";
import { AppContext } from "../../App";
import { useRedirect } from "../../core/hooks/useRedirect";
import ExpenseModal from "./partials/ExpenseModal";
import ExpensesTable from "./partials/ExpensesTable";
import { useTranslation } from "react-i18next";
import Csv from "./partials/Csv";
import backend from "../../api/functions/backend";
import HelpPopover from "../../core/elements/HelpCenter/partials/HelpPopover";
import useButtonRightPosition from "../../core/hooks/useButtonRightPosition";
import ExpenseDataCustomizer from "./partials/ExpenseDataCustomizer";

const defaultCycle = {
    id: 0,
    start_date: null,
    end_date: null
};

const Expenses = React.memo(() => {
    const { AuthContext, HelpContext } = React.useContext(AppContext);
    useRedirect(AuthContext.state, true);

    const [component, setComponent] = React.useState({
        expenses: null,
        currentExpense: null,
        render: 0,
        currentCycle: defaultCycle,
        cycles: [defaultCycle],
        currentCategories: [],
    });

    const { t } = useTranslation();

    const handleCurrentExpense = React.useCallback(function (expense) {
        setComponent(C => {
            return { ...C, currentExpense: expense };
        });
    }, []);

    const reRender = React.useCallback(function () {
        setComponent(C => {
            return { ...C, render: ++C.render };
        })
    }, []);

    React.useEffect(() => {
        backend('/cycle/get')
            .then(response => {
                if (response.data) {
                    const { cycles } = response.data;

                    setComponent(C => {
                        return { ...C, cycles: C.cycles.concat(cycles), currentCycle: cycles[cycles.length - 1] };
                    });
                }
            })
    }, []);

    React.useEffect(() => {
        backend('/expenses/get', {
            cycle_id: component.currentCycle.id,
            categories: component.currentCategories
        }, "POST")

            .then(response => {
                if (response.data?.expenses) {
                    setComponent(C => {
                        return { ...C, expenses: response.data.expenses };
                    })
                }
            })
    }, [component.render, component.currentCycle, component.currentCategories]);

    const setCurrentCycle = React.useCallback((cycle_id) => {
        const currentCycle = component.cycles.find(cycle => cycle.id === cycle_id);
        if (currentCycle) {
            setComponent(C => {
                return { ...C, currentCycle }
            });
        };
    }, [component.cycles]);

    const setCurrentCategories = React.useCallback((newCurrentCategoriesId) => {
        setComponent(C => {
            return { ...C, currentCategories: newCurrentCategoriesId };
        })
    }, []);

    const helpButtonPosition = useButtonRightPosition();
        
    if (AuthContext.state) {
        return <>
            <div className="container-fluid mt-4">
                <div className="col-lg-10 col">
                    <div className="my-3">
                        <div className="display-5"><i className="fa fa-donate"></i> {t('expenses')}</div>
                    </div>

                    {component.cycles.length > 0 &&
                        <CycleForm
                            currentCycle={component.currentCycle}
                            cycles={component.cycles}
                            setCurrentCycle={setCurrentCycle} />}

                    <div className="my-3 col-md-3 col-sm-6 col-12">
                        <ExpenseDataCustomizer
                            currentCycle={component.currentCycle}
                            currentCategories={component.currentCategories}
                            setCurrentCategories={setCurrentCategories} />
                    </div>

                    {component.expenses && <>
                        <div className="my-3">
                            <ExpensesTable
                                setCurrentExpense={handleCurrentExpense}
                                expenses={component.expenses} />
                        </div>
                        <div className="my-3">
                            <Csv data={component.expenses} />
                        </div>
                    </>}

                    {!component.expenses && <SpinnerDisplayer />}

                </div>
            </div>

            {HelpContext.state && <span style={{
                position: "fixed",
                bottom: '60px',
                right: helpButtonPosition
            }}>
                <HelpPopover
                    number={4}
                    type="button"
                    className="btn text-danger"
                    title={t('register_expense')}
                    content={t('quick_register_expense_content')}>
                    <i className="fa fa-plus-circle fa-3x"></i>
                </HelpPopover>
            </span>}

            {!HelpContext.state && component.cycles.length > 1 &&
                <FloatingButton
                    data-bs-target="#expenseModal"
                    data-bs-toggle="modal"
                    onClick={() => { handleCurrentExpense(null) }}
                    toggler="register"/>}

            {component.cycles.length > 1 &&
                <ExpenseModal
                    current={component.currentExpense}
                    reRender={reRender}
                    cycle={component.cycles[component.cycles.length - 1]} />}

            {component.currentExpense &&
                <DeleteDialogModal object={component.currentExpense} reRender={reRender}
                    handleCurrentObject={handleCurrentExpense} />}
        </>
    }
})

export default Expenses;