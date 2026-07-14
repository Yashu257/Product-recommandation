<?php

declare(strict_types=1);

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Services\Admin\DashboardService;
use Core\Http\Request;
use Core\Http\Response;

class DashboardController extends BaseController
{
    private readonly DashboardService $service;

    public function __construct()
    {
        $this->service = new DashboardService();
    }

    public function index(Request $request): mixed
    {
        $kpis               = $this->service->getKpis();
        $recentRegistrations = $this->service->getRecentRegistrations();
        $chartData          = $this->service->buildChartData();
        $inlineScript       = 'window.ADMIN_CHARTS = ' . json_encode($chartData, JSON_HEX_TAG | JSON_HEX_AMP) . ';';

        return $this->view('admin/dashboard/index', [
            'kpis'                => $kpis,
            'recentRegistrations' => $recentRegistrations,
            'inlineScript'        => $inlineScript,
            'pageTitle'           => 'Dashboard',
            'activePage'          => 'dashboard',
        ], 'admin/layouts/main');
    }

    /** AJAX endpoint — refreshed stats card values. */
    public function stats(Request $request): mixed
    {
        return Response::json($this->service->getKpis());
    }
}
