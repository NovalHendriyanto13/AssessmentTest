# AssessmentTest

## Description

The application for Assessment Test KYZN testing purpose only. The application is using expressJS as backend and ReactJs as frontend with MYSQL DB

## Requirements
This application needs following:
Backend: NodeJS v18 or higher
Frontend: NodeJS v20 or higher
Database: MYSQL

## Installation

```bash
# install the dependency for backend
$ cd ./backend && npm install

# install the dependency for frontend
$ cd ./frontend && npm install
```

## Migration and Seeder
```bash
# migrate the table, it will automatically create table for you
$ cd ./backend

# open package.json and remove 1 line code temporary
$ cat package.json
# delete "type": "module" for temporary

$ npm run migrate
$ npm run seeder

# open package.json and put back the code that you delete
$ cat package.json
# put back "type": "module" for temporary
```

## Running the application

```bash

# Backend side
$ npm run dev

# Frontend Side
$ npm run dev

```

## ENV File

```bash
# Backend ENV
NODE_ENV=development
APP_PORT=8000

DB_HOST=127.0.0.1
DB_NAME=kyzn
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password

# Frontend ENV
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=InvoiceApp
```

## Author
Noval Hendriyanto. You can contact me by email no.shinigami13@gmail.com

## !!! Important Notes
if the application can not do migration or seeder, please remove "type": "module" in backend/package.json