<?php
namespace App\Controllers;

use App\Model\Consumer_Notification;
use Core\Websocket\Websocket;

class NotificationsController extends Controller
{
    public function get()
    {
        Auth()->verify(true);

        $consumerNotificationModel = Consumer_Notification::getInstance();

        $consumerNotifications = $consumerNotificationModel
            ->select()
            ->with('notification')
            ->where(['consumer_id' => Auth()->user()->get('id')])
            ->orderBy('id', 'DESC')
            ->get();

        foreach ($consumerNotifications as $consumerNotification) {
            $this->unfold($consumerNotification->notification);
        }

        Response()->json(['consumerNotifications' => $consumerNotifications]);
    }

    public function verify()
    {
        Auth()->verify(true);

        $response = [];

        if (!isset($consumerNotificationModel)) {
            $consumerNotificationModel = Consumer_Notification::getInstance();
        }

        $expensesController = new ExpensesController;
        $cycleController = new CycleController;

        $consumption = $expensesController->getConsumption();
        $passedTime = $cycleController->getPassedTime();

        if ($consumption >= 80 && $passedTime < 80) {
            $this->push(2);
        }

        return $response;
    }


    public function unseen()
    {
        Auth()->verify(true);

        $consumerNotificationsModel = Consumer_Notification::getInstance();
        $CNMData = $consumerNotificationsModel
            ->select("COUNT(id) AS unseen")
            ->where(['consumer_id' => Auth()->user()->get('id'), 'seen' => 0])
            ->first();

        Response()->json(['unseen' => $CNMData->unseen]);
    }

    public function push($notification_id)
    {
        if (!isset($consumerNotificationModel)) {
            $consumerNotificationModel = Consumer_Notification::getInstance();
        }

        $consumerNotification = new \App\Objects\Consumer_Notification;
        $consumerNotification
            ->setConsumer(Auth()->user()->get('id'))
            ->setNotification($notification_id)
            ->setDate(UseDate()->get_iso());

        $newNotification = $consumerNotificationModel
            ->create($consumerNotification->get('consumer_id', 'notification_id', 'date'))
            ->save();

        if ($newNotification && $notification_id !== 1) {
            try {
                $pusher = Websocket::getInstance();
                $pusher->trigger('bm-channel-' . $_SERVER['HTTP_X_AUTH_TOKEN'], 'bm-notification-event', '');
            } catch (\Exception $e) {
            }
        }

        return $newNotification;
    }

    public function unfold($request)
    {
        switch ($request->id) {
            case 1:
                $userName = Auth()->user()->get('name');
                $request->title = sprintf(Translate($request->title), $userName);
                $request->content = Translate($request->content);
                break;

            case 2:
                $request->title = Translate($request->title);
                $expensesController = new ExpensesController();
                $cycleController = new CycleController();

                $request->content = sprintf(
                    Translate($request->content),
                    $expensesController->getConsumption(),
                    $cycleController->getDaysLeft()
                );

            case 3:
                $request->title = Translate($request->title);
                $request->content = Translate($request->content);

            default:
                break;
        }
    }

    public function open()
    {
        $id = $_GET['id'];

        if ($id && is_numeric($id)) {
            $consumerNotificationModel = Consumer_Notification::getInstance();
            $success = $consumerNotificationModel
                ->update(['seen' => 1])
                ->where(['id' => $id])
                ->save();

            Response()->json(['success' => $success]);
        }

        Response()->json(['success' => false]);
    }
}