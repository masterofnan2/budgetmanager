import React from "react";
import { AmountDisplayer, DisplayEmpty } from "../../../core/elements/minitatures";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../../App";
import HelpPopover from "../../../core/elements/HelpCenter/partials/HelpPopover";
import { dateFormater } from "../../../core/function/date";

const ExpensesTable = React.memo(({ expenses, setCurrentExpense }) => {
    const { AuthContext, HelpContext } = React.useContext(AppContext);
    const { t } = useTranslation();

    let total = 0;
    return <>
        {expenses.length === 0 && <DisplayEmpty size="lg" />}
        {expenses.length > 0 && <>
            <div className="table-responsive">
                <table className="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th scope="col">{t('amount')} ({AuthContext.settings.currency.name})</th>
                            <th scope="col">{t('category')}</th>
                            <th scope="col">{t('description')}</th>
                            <th scope="col">{t('date')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense, key) => {
                            total += parseFloat(expense.amount);
                            return <tr key={key} onClick={() => { setCurrentExpense(expense) }}
                                data-bs-toggle="modal" data-bs-target="#expenseModal">
                                <td>{expense.amount}
                                    {HelpContext.state && key === 0 &&
                                    <HelpPopover
                                        type="button"
                                        number={1}
                                        className="btn"
                                        title={t('expenses_list')}
                                        content={t('expenses_list_content')} />}</td>
                                <td>{expense.category.name || t('deleted')}</td>
                                <td>{expense.description}</td>
                                <td>{dateFormater(expense.date)}</td>
                            </tr>
                        })}
                    </tbody>
                    <tfoot >
                        <tr>
                            <td colSpan={4} style={{ textAlign: "center" }}><h5>{t('total')} = <AmountDisplayer amount={total} /></h5></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>}
    </>
});

export default ExpensesTable;