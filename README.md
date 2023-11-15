# Project: MoveInLo!

> SC2006 Software Engineering [SCSX Codecrafters]

## Our Project

This project is for an mobile application for MoveInLo! MoveInLo is a mobile application that seeks to smoothen the process of moving in and out of university halls/ hostels for new and existing students in Singapore.

## Members

* SCSE EUGENE WEE JUN LIN (U2120698A)
* SCSE IAIN RODERICK TAY RONG YU (U2221382K)
* SCSE JOSEPH TEO CHEE HOE (U2223041J)
* SCSE JIANG YIFEI (U2201092F)
* SCSE KIM HYUN BIN (U2020316D)

## Video Demo

Here is a link to our video demo of our app: https://youtu.be/cP5oUKL51ws

<hr>

## Set-up Guide for New Developers

> **Note**: Both client and server need to be set up correctly for the mobile app to be fully functional.

> Run the **client & server on separate instances** of your CLI terminal.

### Setting up the Server (Local)

> **Note**: In order to call APIs in React-Native for local development, we would need to specify the IP address.

1. Navigate to the project directory.

```
cd /MoveInLo
```

2. Check your IP address for your MacOS or Windows and update the your `.env` file

```
cp .env.example .env
```

Within the `.env` file,

```
IP_ADDRESS="<insert_your_ip_address>"
PORT=4000
```

3. Navigate to the server directory.

```
cd /server
```

4. Install the server side packages.

```
npm install
```

4. In your CLI terminal, start the server using the following command:

```
node server.js
```

5. You should see the following output in your terminal.

```
Starting up server...
Server is running on port: 4000
MongoDB connected: ac-ib97lax-shard-00-02.03plysc.mongodb.net
```

6. Allow the server to run on this terminal while you run the client mobile app.

<br>
<hr>

### Setting up the Client

1. Navigate to the project directory (if not already there)

```
cd /MoveInLo
```

2. Install dependency packages

```
npm install
```

3. Starting Development Server (You may specify the `--clear` flag to clear local cache. )

```
npx expo start --clear
```

4. Using an emulator (Download ios/ android emulator)
   > Note: You will need to have an ios or android emulator to use this feature. Verify that your simulator is functioning as expected.

```
npx expo start --ios
npx expo start --android
```

**Alternative:** Starting Development Server (Mobile version)

- Note: You will need to install expo on your mobile device to use this feature.

```
npx expo start --tunnel
```

View this link for guide on [Expo Setup](https://docs.expo.dev/workflow/ios-simulator/#expo-cli-is-printing-an-error-message-about-xcrun-what-do-i-do).

<hr>

## File Folder Structure

We adopted the best practice for file folder structure, adhering to `Container-Component` pattern.
This allows us to achieve the following benefits:

1. **Separation of Concerns**
   - By separating the logic and presentation, the pattern improves code maintainability and readability.
   - Containers handle complex logic, while Components focus on rendering UI elements, making it easier to understand and modify individual parts of the codebase.
2. **Reusability**
   - The Container-Component pattern encourages code reuse.
   - Containers can be reused across multiple Components, allowing developers to leverage the same logic in different parts of the application.
3. **Testability**
   - Containers, being responsible for the business logic, can be easily unit tested in isolation. This facilitates testing and ensures that the logic is functioning correctly, enhancing the stability of the application.
4. **Collaboration**
   - Developers can work on different parts of the application simultaneously and independently.

### Structure:

- `src/api`: API resources
- `src/app`: Expo File-folder Routing
- `src/assets`: Images, fonts, and other static resources
- `src/screens`: Individual application screens
- `src/component`: Reusable UI components

## Developer Guide

For frontend routing convention, we will adhere by the following standards for readability
and adherence to the Expo best practices.

- Create a `_layout.js` and `index.js` for each page.
- Nested routes can be accessed using the following convention, with each nested route being a directory.
  - `customer/schedule/scheduler`
