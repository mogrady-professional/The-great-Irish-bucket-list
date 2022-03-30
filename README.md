<h1 align="center">The Great Irish Bucket List: 35 places you have to visit.<br>Simple Full-Stack To-Do App in Node.js</h1>

<p align="center"><img src="images/screencapture-localhost-3000-2022-03-30-21_25_14.png"  height="auto" width="100%">
</p>

### Table of Contents

- [Introduction](#introduction)
  - [Package used](#package-used)
- [Instructions for running the application locally](#instructions-for-running-the-application-locally)
  - [Where <your_connection_string_goes_here> is your own unique connection string to your own MongoDB cluster.](#where-your_connection_string_goes_here-is-your-own-unique-connection-string-to-your-own-mongodb-cluster)
- [Live application](#live-application)
- [Details](#details)
- [Security](#security)
  - [Automatic Node App Restarts](#automatic-node-app-restarts)
- [Connecting to the MongoDB Cluster remotely](#connecting-to-the-mongodb-cluster-remotely)
  - [Retrieve connection string](#retrieve-connection-string)
  - [Using Axios](#using-axios)
  - [Working with Promises in JavaScript](#working-with-promises-in-javascript)
  - [Using the HTML5 feature: data-id](#using-the-html5-feature-data-id)
  - [Using event.target.getAttribute()](#using-eventtargetgetattribute)
  - [Editing Data on the Client Side](#editing-data-on-the-client-side)
  - [Deleting Data](#deleting-data)
  - [Posting Data back to the Server without requiring form submit and page reload](#posting-data-back-to-the-server-without-requiring-form-submit-and-page-reload)
    - [Improving the Create Feature](#improving-the-create-feature)
      - [Using an Ansyncronous method to create data on the fly](#using-an-ansyncronous-method-to-create-data-on-the-fly)
      - [Using browser side rendering to cut down on duplication](#using-browser-side-rendering-to-cut-down-on-duplication)
    - [Sanitization of HTML for security of user input](#sanitization-of-html-for-security-of-user-input)

# Introduction

This is a quick, basic and simple "to-do" application (not industry standard) demonstrating client side JavaScript DOM manipulation, validation using the sanitize-html NPM package, MongoDB as the database for document storage and retrieval, along with server-side JavaScript code in Node.js on an Express backend server back-end.
Protected routes with

## Package used

- express@4.17.3
- mongodb@4.4.0
- nodemon@2.0.15
- sanitize-html@2.7.0

# Instructions for running the application locally

To run the application for the first time, clone or download the repo and run the following commands:

- `npm install`
- `nodemon server`

This will start a development server on `PORT:3000`

- Open a browser and navigate to the following URL `http://localhost:3000/`

Create an .env file and enter the following:

- MONGOCLIENT_CONNECTION_STRING=<your_connection_string_goes_here>

## Where <your_connection_string_goes_here> is your own unique connection string to your own MongoDB cluster.

# Live application

To view the live application visit the following URL:

---

# Details

Project Schema

```
.
├── public -> Client Public Side
│   ├── browser.js -> Client-side JavaScript
│   └── assets
│     └── img
│     └── css
│       └── style.css
├── server.js -> Server-side code in Node.js with an Express Back-end
```

# Security

Application security using WWW-Authenticate with base-64 encoding. Enter the following credentials at the alert prompt:

- username: discover
- password: ireland

### Automatic Node App Restarts

```json
    "watch": "nodemon server",
```

# Connecting to the MongoDB Cluster remotely

## Retrieve connection string

Open the connect to cluster modal
Select:

- connect your application
  - select Node.js driver

> Provide database details

- Database Name: **\_\_\_\_**
- Collection: **\_\_\_**

Update the connection string with:

- username
- password
- database name

## Using Axios

You can use Axios to tell the web browser to send a request to the server, without submitting a form, or visiting a URL.
You can juse send a request to the server on the fly, behind the scenes.

This i usually done in the modern way by using a feature modern web browsers have called _**fetch**_.

But instead, we will use _**axios**_.

Axios lets us keep the code that we write, super clean and super minimal

- [Axios Docs (Instructions)](https://github.com/axios/axios)

Get the link to the script from the documentation, i.e.:

```js
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

Paste this within the res.send element within the server.js (Node JavaScript file) to output this script to the browser.

## Working with Promises in JavaScript

Within the Axios code we will be working with promises. A promise is useful when we are not sure how long an action is going to take.

Within the .then() is where you include a function that is not going to run until the action has had a chance to complete.

Within the .catch() is where you include a function to include for if the action runs into the problem

## Using the HTML5 feature: data-id

This is a HTML5 feature that lets us embed data right within the HTML

Now we can retrieve the id of the field within the edit button which enables us to change or update that record in the database.

## Using event.target.getAttribute()

We can use this to retrieve the id of the object within the client-side JavaScript code.

We can now

## Editing Data on the Client Side

By using methods on the document object such as ; we can access elements on the page to prepopulate the prompt, and submit the updated item to the database.

## Deleting Data

Create new method in the browser js file (frontend) to delete the element from the document and call axios

Create new method in the server js file (backend) to listen to the post request (of delete)

## Posting Data back to the Server without requiring form submit and page reload

### Improving the Create Feature

#### Using an Ansyncronous method to create data on the fly

> Get whatever value the user enters in the input, then use Axios to send off an Asyncronous request to our node server

in the server.js send back JSON object that represents the new element id that was created to the browser

#### Using browser side rendering to cut down on duplication

by using JSON.stringify() we can instead pass the data from the Object from the server to the browser
So now we can delete the HTML template within the server and instead make this browser based instead

### Sanitization of HTML for security of user input

This is completed using sanitize-html NPM package
