<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

class MovieController extends ApiBaseController
{
    private $apiKey;
    private $baseUrl = 'http://www.omdbapi.com/';

    public function __construct()
    {
        $this->apiKey = config('services.omdb.key');
    }

    private function fetchFromOmdb(array $params)
    {
        $params['apikey'] = $this->apiKey;
        $url = $this->baseUrl . '?' . http_build_query($params);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        $response = curl_exec($ch);
        curl_close($ch);

        if (!$response) {
            return [
                'Response' => 'False',
                'Error' => 'Failed to connect to OMDb API'
            ];
        }

        return json_decode($response, true);
    }

    public function search(Request $request)
    {
        $search = $request->query('s');
        $page = $request->query('page', 1);
        $type = $request->query('type');
        $year = $request->query('y');

        // OMDb search requires search parameter
        if (empty($search)) {
            return $this->_successResponse([
                'Search' => [],
                'totalResults' => '0',
                'Response' => 'True'
            ]);
        }

        $params = [
            's' => $search,
            'page' => $page,
        ];

        if (!empty($type)) {
            $params['type'] = $type;
        }

        if (!empty($year)) {
            $params['y'] = $year;
        }

        $result = $this->fetchFromOmdb($params);

        if (isset($result['Response']) && $result['Response'] === 'False') {
            return $this->_errorResponse($result, 400, 'ID', $result['Error'] ?? 'Movie not found');
        }

        return $this->_successResponse($result);
    }

    public function show($id)
    {
        $result = $this->fetchFromOmdb([
            'i' => $id,
            'plot' => 'full'
        ]);

        if (isset($result['Response']) && $result['Response'] === 'False') {
            return $this->_errorResponse($result, 404, 'ID', $result['Error'] ?? 'Movie details not found');
        }

        return $this->_successResponse($result);
    }
}
