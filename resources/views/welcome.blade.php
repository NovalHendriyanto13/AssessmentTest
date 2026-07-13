<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>FlixNet - Movie Discovery</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        
        <!-- Styles -->
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
        <style>
            html, body {
                margin: 0;
                padding: 0;
                background-color: #0B0F19; /* Sleek Deep Navy/Dark Background */
                color: #F3F4F6;
                font-family: 'Plus Jakarta Sans', 'Outfit', sans-serif;
                min-height: 100vh;
                overflow-x: hidden;
            }
            
            /* Custom Scrollbar */
            ::-webkit-scrollbar {
                width: 8px;
            }
            ::-webkit-scrollbar-track {
                background: #0B0F19;
            }
            ::-webkit-scrollbar-thumb {
                background: #1F2937;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #374151;
            }
        </style>
    </head>
    <body>
        <div id="app">
            <!-- Mounting Vue SPA -->
            <app-component></app-component>
        </div>

        <!-- Compiled JS -->
        <script src="{{ asset('js/app.js') }}"></script>
    </body>
</html>
