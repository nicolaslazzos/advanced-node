# advanced-node
Project made during the "Node.js Advanced Concepts" course on Udemy.

## Install Necessary Tools

  - WSL: https://docs.microsoft.com/en-us/windows/wsl/install-win10
  - redis-server: inside the WSL https://anggo.ro/note/installing-redis-in-ubuntu-wsl/

## Run the Project

Install the packages both in the server and client

```
npm i
cd client
npm i
cd ..
```

Start the redis server

```
sudo service redis-server start
```

Run the project in development mode

```
npm run dev
```
The project will run in `http://localhost:3000` and the backend will run in `http://localhost:5000`

## Run the Tests

With the project running

```
npm run test
```
If an error like `Puppeteer Error: Chromium revision is not downloaded` appears, then run the following command to install chromium
```
node node_modules/puppeteer/install.js
```

## Stop the project

```
Ctrl+C
```

