<?php

namespace App\Controllers;

use App\Model\ModelFactory;
use App\Objects\Cycle;

class CycleController extends Controller
{
    private function getDefault(): Cycle
    {
        $start_date_iso = UseDate()->get_iso();
        $end_date_iso = UseDate()->add("7 days")->format("Y-m-d");
        $renewal_frequency_id = 2;
        $consumer_id = Auth()->user()->get('id');

        $cycle = new Cycle;
        $cycle
            ->setConsumer($consumer_id)
            ->setStartDate($start_date_iso)
            ->setEndDate($end_date_iso)
            ->setRenewalFrequency($renewal_frequency_id);

        return $cycle;
    }

    /**
     * Inserts a new row of data in the Cycle table
     * @param \StdClass|null $request The input data to insert in the table
     * @return \stdClass|bool Boolean in case of failure, the insterted data otherwise;
     */
    public function create(?Cycle $cycle = null)
    {
        if (!$cycle) {
            $cycle = $this->getDefault();
        }

        $cycleModel = ModelFactory::getInstance('cycle');

        $cycleData = $cycleModel
            ->create($cycle->get('consumer_id', 'start_date', 'end_date', 'renewal_frequency_id'))
            ->save();

        if ($cycleData) {
            $cycle->setId($cycleData->id);
            Auth()->setCycle($cycle);
        }

        return $cycleData;
    }

    public function recycle()
    {
        $cycleModel = ModelFactory::getInstance('cycle');
        $previousCycle = $cycleModel
            ->select()
            ->where(['consumer_id' => Auth()->user()->get('id')])
            ->last();

        $date_now = UseDate()->create();
        $date_now_iso = UseDate()->get_iso();

        $previous_end_date = $previous_start_date = null;
        $lifeSpan = "7 days";
        $cycle = new Cycle;

        if ($previousCycle && ($date_now_iso >= $previousCycle->end_date)) {

            $previous_end_date = UseDate()->create($previousCycle->end_date);
            $previous_start_date = UseDate()->create($previousCycle->start_date);

            $lifeSpanInDays = date_diff($previous_start_date, $previous_end_date)->days;

            if ($lifeSpanInDays > 0) {
                $lifeSpan = "$lifeSpanInDays days";
            }

        } else {
            $previous_end_date = $date_now;
        }

        $previous_end_date_plus_lifespan_iso = UseDate()->add($lifeSpan, $previous_end_date)->format('Y-m-d');

        $new_start_date = ($date_now_iso > $previous_end_date_plus_lifespan_iso) ? $date_now : $previous_end_date;
        $new_end_date = UseDate()->add($lifeSpan, $new_start_date);

        $cycle
            ->setConsumer(Auth()->user()->get('id'))
            ->setRenewalFrequency($previousCycle->renewal_frequency_id)
            ->setStartDate(UseDate()->get_iso($new_start_date))
            ->setEndDate(UseDate()->get_iso($new_end_date));

        $newCycleData = $this->create($cycle);

        if ($newCycleData) {

            if ($previousCycle) {
                $_SESSION['previousCycle'] = $previousCycle;

                $defaultCategoryController = new DefaultCategoryController;
                $defaultCategoryController->recycle();

                $budgetController = new BudgetController;
                $budgetController->recycle();
            }

            $notificationController = new NotificationsController;
            $notificationController->push(3);
        }

        return $newCycleData;
    }

    public function get()
    {
        Auth()->verify(true);

        $cycleModel = ModelFactory::getInstance('cycle');
        $cycles = $cycleModel
            ->select('id', 'start_date', 'end_date')
            ->with('renewal_frequency')
            ->where(['consumer_id' => Auth()->user()->get('id')])
            ->orderBy('id')
            ->get();

        Response()->json(['cycles' => $cycles]);
    }

    public function getPassedTime(): int
    {
        $cycle = Auth()->cycle()->get();

        $cycle_end_date = UseDate()->create($cycle['end_date']);
        $cycle_start_date = UseDate()->create($cycle['start_date']);

        $lifeSpan = date_diff($cycle_start_date, $cycle_end_date)->days;
        $useDuration = date_diff($cycle_start_date, UseDate()->create())->days;

        $passedTime = floor($useDuration * 100 / $lifeSpan);

        return $passedTime;
    }

    public function getDaysLeft(): int
    {
        $cycle = Auth()->cycle()->get();

        $cycle_end_date = UseDate()->create($cycle['end_date']);
        $now_date = useDate()->create();

        $daysLeft = date_diff($cycle_end_date, $now_date)->days;
        return $daysLeft;
    }
}