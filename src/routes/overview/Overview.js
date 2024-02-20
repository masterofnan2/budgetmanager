import React from "react";
import backend from "../../api/functions/backend";
import { CycleForm, SpinnerDisplayer } from "../../core/elements/minitatures";
import LineChart from "./partials/LineChart";
import { AppContext } from "../../App";
import { useRedirect } from "../../core/hooks/useRedirect";
import { useTranslation } from "react-i18next";

const Overview = React.memo(() => {

    const { AuthContext } = React.useContext(AppContext);
    useRedirect(AuthContext.state, true);

    const { t } = useTranslation();

    const [component, setComponent] = React.useState({
        cycles: null,
        currentCycle: null
    });

    React.useEffect(() => {
        if (AuthContext.state) {
            backend('/cycle/get')
                .then(response => {
                    if (response.data) {
                        const { cycles } = response.data;
                        setComponent(C => {
                            return { ...C, cycles, currentCycle: cycles[cycles.length - 1] };
                        });
                    }
                })
        }
    }, [AuthContext]);

    const setCurrentCycle = React.useCallback((cycle_id) => {
        const cycle = component.cycles?.find(cycle => parseInt(cycle.id) === cycle_id);

        if (cycle) {
            setComponent(C => {
                return { ...C, currentCycle: cycle };
            });
        }
    }, [component.cycles]);

    if (AuthContext.state) {
        return <div className="container-fluid mt-0 mt-md-3">
            <div className="col-lg-10 col">
                <div>
                    <div className="display-5"><i className="fa fa-chart-pie"></i>verview</div>
                    <p>{t('museum_data')}</p>
                </div>
                {component.cycles && <>
                    <div className="mt-3">
                        <CycleForm
                            currentCycle={component.currentCycle}
                            cycles={component.cycles}
                            setCurrentCycle={setCurrentCycle} />
                    </div>
                    <div className="mt-3">
                        <LineChart currentCycle={component.currentCycle} />
                    </div>
                </>}

                {!component.cycles && <SpinnerDisplayer />}
            </div>
        </div>
    }
});

export default Overview;