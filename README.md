# Snappy - Chat Application 
Snappy is chat application build with the power of MERN Stack. You can find the tutorial [here](https://www.youtube.com/watch?v=otaQKODEUFs)


![login page](./images/snappy_login.png)

![home page](./images/snappy.png)

## Installation Guide

### Requirements
- [Nodejs](https://nodejs.org/en/download)
- [Mongodb](https://www.mongodb.com/docs/manual/administration/install-community/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)
- [Docker](https://docs.docker.com/desktop/setup/install/windows-install/)

#### Use Ubuntu 24.04 (Option)

Install dependencies with script

```
git clone https://github.com/LyHoangViet/chat-app-real-time.git
cd chat-app-real-time
./install_dept.sh
```

Both should be installed and make sure mongodb is running.
### Installation

#### First Method
```shell
git clone https://github.com/LyHoangViet/chat-app-real-time.git
cd chat-app-real-time
```
Now rename env files from .env.example to .env
```shell
cd public
mv .env.example .env
cd ..
cd server
mv .env.example .env
cd ..
```

Now install the dependencies
```shell
cd server
npm install
cd ..
cd public
npm install
```
We are almost done, Now just start the development server.

For Frontend.
```shell
cd public
yarn start
# or
npm start
```
For Backend.

Open another terminal in folder, Also make sure mongodb is running in background.
```shell
cd server
yarn start
# or
npm start

```
Done! Now open localhost:3000 in your browser.

#### Second Method
- This method requires docker and docker-compose to be installed in your system.
- Make sure you are in the root of your project and run the following command.

```shell
sudo docker compose up --build
```
now open localhost:3000 in your browser.
