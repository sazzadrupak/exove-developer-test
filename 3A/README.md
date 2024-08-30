# 3A. Get data and save it locally

### Language and Libraries

- Node.js
- Express.js
- TypeScript
- Eslint
- Postgres
- Docker

### Important notes about the project architecture

- This is a dockerized project, Why? I don't want you to create an environment for the project. If you have docker installed in your computer (I pray :pray:), then you don't need to install anything related to the project, even the postgre database. This project is designed that way.
- The _backend_ directory is responsible for running the server, fetch and save data, get data from database using API
- The _db_ directory is responsible to run a postgres container with provided db schema. You'll find the schema file inside the **config** directory, named **init.sql**.

### How to run the project with docker

- Close the repo
- In your terminal, go to the **3A** directory where the `docker-compose.yml` file is.
- Run this command `docker compose up --build`. After containers running successfully (if GOD wants :crossed_fingers:), you'll see this message at the end of your terminal screen **_Server is running on port 3000_**

By this time the products data will be fetched from the API and stored into the database already.

### Debug the project

- I have added an GET api to fetch the products data. Go to your browser, open a new tab and paste this url `http://localhost:3000/v1/products` in the adderss bar, press enter and you'll see the list of products on the browser screen

- If you want to debug the database table, run this command in a new tab of your terminal `docker exec -it postgres psql -h db -U exove exove_product`. You'll be asked to provide the password which is `exove` (You'll get the information from `.env` file in the **3A** directory. After successful authentication, you'll be granted the access to the **postgres** container. Now you can do the debugging (e.g. check tables, select data, etc...)
