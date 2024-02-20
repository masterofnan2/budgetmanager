<?php

namespace Core\Validator;

use App\Model\Renewal_Frequency;

class CycleValidator extends Validator
{
    protected function renewal_frequency_id(): CycleValidator
    {
        $rfi = $this->object->get('renewal_frequency_id');
        if (!$rfi) {
            $this->messages['renewal_frequency_id'] = Translate('renewal frequency required');
        } else {
            $rfiModel = Renewal_Frequency::getInstance();
            $rfiExists = $rfiModel
                ->select()
                ->where(['id' => (int) $rfi])
                ->first();

            if (!$rfiExists) {
                $this->messages['renewal_frequency_id'] = Translate('renewal frequency not found');
            }
        }

        return $this;
    }

    protected function start_date(): CycleValidator
    {
        $start_date = $this->object->get('start_date');

        if (!$start_date) {
            $this->messages['start_date'] = Translate('start date required');
        } else {
            $cycle_start_date = Auth()->cycle()->get('start_date');

            if ($start_date < $cycle_start_date) {
                $this->messages['start_date'] = Translate('start date early');
            }
        }

        return $this;
    }

    protected function end_date(): CycleValidator
    {
        $end_date_iso = $this->object->get('end_date');

        if (!$end_date_iso) {
            $this->messages['end_date'] = Translate('next renewal date required');
        } else {
            $start_date = UseDate()->create(Auth()->cycle()->get('start_date'));
            $start_date_iso = UseDate()->get_iso($start_date) ;

            if ($start_date_iso) {
                $end_date = UseDate()->create($end_date_iso);

                switch ((int) $this->object->get('renewal_frequency_id')) {
                    case 2:
                        if ($start_date_iso >= $end_date_iso || date_diff($start_date, $end_date)->days !== 7) {
                            $this->messages['end_date'] = Translate('next renewal should be after a week');
                        }

                        break;

                    case 3:
                        if ($start_date_iso >= $end_date_iso || date_diff($end_date, $start_date)->m !== 1) {
                            $this->messages['end_date'] = Translate('next renewal should be after a month');
                        }
                        break;

                    default:
                        if ($start_date_iso >= $end_date_iso || date_diff($start_date, $end_date)->days < 1) {
                            $this->messages['end_date'] = Translate('next renewal should be after a day');
                        }
                        break;
                }
            }
        }

        return $this;
    }
}