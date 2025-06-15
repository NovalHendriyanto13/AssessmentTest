# AssessmentTest

## Description

The application for Email Scheduler SDT testing purpose only. The application is using docker to run but can be run stand alone as well. It is using Mongo DB for store data

## Installation

```bash
# install the dependency, if you want to run without docker
$ npm install

OR 

# for setup docker run and build docker one time only
$ docker-compose build

# run the application
$ docker-compose up

# install dev dependency inside docker
$ docker exec -it sdt /bin/sh
$ npm install --save-dev @types/express @types/body-parser @types/mongoose

```

## Running the application

```bash

#endpoints

#this endpoint is used for create a new data and store it into Mongo DB
http://localhost:3000/api/birth-day [POST]

payload: {
  "firstName": "Alice",
  "lastName": "Doe",
  "email": "no.shinigami13@gmail.com",
  "birthday": "1990-06-14",
  "timezone": "America/New_York"
}

#this endpoint is fetching all data in list
http://localhost:3000/api/birth-day [GET]

#this endpoint is fetching one row data with specified ID
http://localhost:3000/api/birth-day/:id [GET]

#this endpoint is update data based on ID
http://localhost:3000/api/birth-day/:id [PUT]

payload: {
  "firstName": "Alice",
  "lastName": "Doe",
  "email": "no.shinigami13@gmail.com",
  "birthday": "1990-06-14",
  "timezone": "America/New_York"
}

#this endpoint is fetching all data in list
http://localhost:3000/api/birth-day/:id [DELETE]

#Additional endpoint to get the list of timezone as array
http://localhost:3000/api/common/timezone [GET]

```

## ENV File

```bash
APP_NAME="SDT"
APP_PORT=3000

MONGO_URI="mongodb://mongo:27017/birthdaydb"
SDT_EMAIL_BASE_API="https://email-service.digitalenvision.com.au/send-email"