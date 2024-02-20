import React from "react";
import backend from "../../../../api/functions/backend";
import { DisplayEmpty, SpinnerDisplayer } from "../../../../core/elements/minitatures";
import { HomepageRenderContext } from "../isAuth";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../../../App";
import HelpPopover from "../../../../core/elements/HelpCenter/partials/HelpPopover";
import { useNavigate } from "react-router-dom";

const Expenses = React.memo(function () {
    const [component, setComponent] = React.useState({
        expenses: null
    });

    const { expenses } = component;

    const { render } = React.useContext(HomepageRenderContext);
    const { HelpContext } = React.useContext(AppContext);

    const navigate = useNavigate();

    React.useEffect(() => {
        backend('/expenses/get?limit=3')
            .then(response => {
                if (response.data?.expenses) {
                    setComponent(C => {
                        return { ...C, expenses: response.data.expenses };
                    })
                }
            })
    }, [render]);

    const { t } = useTranslation();

    if (expenses) {
        return <>
            <div className="d-flex" type="button" onClick={() => navigate('/expenses')}>
                <h5><i className="fa fa-calendar-alt"></i> {t('expenses')}</h5>
                <p className="mx-2">({t('most_recent')})</p>
                {HelpContext.state &&
                    <HelpPopover
                        type="button"
                        number={3}
                        className="btn"
                        title={t('recent_expenses')}
                        content={t('recent_expenses_content')} />}
            </div>

            {expenses.length > 0 && <>
                <ul className="list-group">
                    {expenses.map(expense => {
                        return <li className="list-group-item" key={expense.id}>{expense.category.name || t('deleted')} ({expense.amount})</li>
                    })}
                </ul>
            </>}

            {expenses.length === 0 && <DisplayEmpty size="sm" />}
            {!expenses && <SpinnerDisplayer />}
        </>
    }
});

export default Expenses;