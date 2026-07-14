<?php

declare(strict_types=1);

namespace App\Controllers\Frontend;

use App\Controllers\BaseController;
use App\Repositories\EventRepository;
use Core\Http\Request;
use Core\Http\Response;

class HomeController extends BaseController
{
    private readonly EventRepository $eventRepo;

    public function __construct()
    {
        $this->eventRepo = new EventRepository();
    }

    public function index(Request $request): Response
    {
        $events = $this->eventRepo->allPublished();

        return $this->view('frontend.home.index', [
            'events'    => $events,
            'pageTitle' => 'Welcome to PharmaWebcast',
        ]);
    }

    public function events(Request $request): Response
    {
        $events = $this->eventRepo->allPublished();

        return $this->view('frontend.events.index', [
            'events'    => $events,
            'pageTitle' => 'Upcoming Webcasts',
        ]);
    }
}
