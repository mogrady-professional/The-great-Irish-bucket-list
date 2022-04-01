// Secret Connection String
require("dotenv").config();
let MONGOCLIENT_CONNECTION_STRING = process.env.MONGOCLIENT_CONNECTION_STRING;

// Goal -> Create a server that listens for incoming requests

// First create a package.json file ->  npm init -y
let express = require("express"); // Need to bring this using npm -> npm install express
let sanitizeHTML = require("sanitize-html"); // Protect against malicious input
let { MongoClient, ObjectId } = require("mongodb"); // Bring in MongoClient and ObjectId from mongodb

// ObjectId -> MongoDB object to retrieve and work with an item (id) of an object from the MongoDB Database

let app = express(); // cal express
let db;

// Make the port dynamic for running on both the server and hosting provider -> Heroku
let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

// Pass in the name of the folder; bring in browser client side JS
app.use(express.static("public"));

async function go() {
  // wait for connection
  let client = new MongoClient(MONGOCLIENT_CONNECTION_STRING); // secret connection string

  await client.connect();
  db = client.db();
  // Now by the time the application starts running, it will be pointing towards the database

  app.listen(port); // Listen for incoming requests on the port
}

go();

app.use(express.json()); // Asyncronous requests

// Configures the express framework to include the body object which gets added on to the request object -> in other words, access the users form data!
app.use(express.urlencoded({ extended: false })); // Submitted Forms

// Password Protection
function passwordProtected(req, res, next) {
  // console.log("passwordProtected Function Just Ran");
  res.set("WWW-Authenticate", 'Basic relm="The Great Irish Bucket List"'); // Ask the web browser to authenticate; with a title
  console.log(req.headers.authorization); // Check the headers of the request -> pass through username and password from browser to server and convert to base64
  // Secret Connection String -> encoded into base 64 format
  if (req.headers.authorization == "Basic ZGlzY292ZXI6aXJlbGFuZA==") {
    next();
  } else {
    // 401 -> unauthorized
    // Send back status and message to the browser
    res.status(401).send("Authentication required");
  }
}

// Password protected route
app.use(passwordProtected);

// Tell server what to do when a get request is made to the root of the server
// Run the passwordProtected function when the get request is made

app.get("/", passwordProtected, function (req, res) {
  // a) Send back a response
  // Anonymous function, pass in parameters
  // Parameters -> req -> request object -> contains information about the request
  // Parameters -> req -> response object -> contains information about the response

  // find() -> is the mongodb way of loading data
  // toArray() -> converts into a JavaScript Array
  db.collection("items")
    .find()
    .toArray(function (err, items) {
      // res.send("Hello, welcome the app.");
      // console.log(items);

      // The below is NOT industry standard, this is just to give a demonstration of how server response can be done for beginners.
      res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple The Great Irish Bucket List</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
      </head>
      <body>
        <div class="container">
          <h1 class="display-4 text-center py-1">The Great Irish Bucket List</h1>       
          <div class="jumbotron p-3 shadow-sm">
            <form id="create-form" action="/create-item" method="POST">
              <div class="d-flex align-items-center">
                <input id="create-field"  name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
              </div>
            </form>
          </div>
          
          <ul id="item-list" class="list-group pb-5"> 
  
          </ul>
          <!-- join() method converts array into string of text -->
        </div>
        <script> let items = ${JSON.stringify(items)}</script>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="/browser.js"></script>
      </body>
      </html>`);
    }); // You could place a query here in the find() also!
});

// POST route for creating a new item -> page the user will be sent to after the form submit (POST)
app.post("/create-item", passwordProtected, function (req, res) {
  // console.log(req.body.item); // inside the body of the html above!

  // Sanitize the input
  // package takes two parameters, the text to sanitize and options. See the npm package for details
  let safeText = sanitizeHTML(req.body.text, {
    allowedTags: [],
    allowedAttributes: {},
  }); // do not allow HTML tags or attributes

  // Create a new Document in MongoDB Database
  // Insert object into the database
  db.collection("items").insertOne(
    {
      //   text: req.body.item,
      text: safeText,
    },
    function (err, info) {
      // Response to the user.
      //   res.send("Thank you for submitting the form.");
      //   res.redirect("/");
      //   res.send("Success");
      res.json({ _id: info.insertedId, text: safeText });
    }
  );
});

// Set up express server to recieve that incoming code from Axios
// in the command line -> node server
// Using Axios
app.post("/update-item", function (req, res) {
  //   console.log(req.body.text);
  //   res.send("Success");

  let safeText = sanitizeHTML(req.body.text, {
    allowedTags: [],
    allowedAttributes: {},
  }); // do not allow HTML tags or attributes!
  // package takes two parameters, the text to sanitize and options. See the npm package for details

  //Working with the database
  // findOneAndUpdate() built in MongoDB Method
  db.collection("items").findOneAndUpdate(
    {
      // MongoDB requires new ObjectId() [Tool from the MongoDB Package -> Import it]
      _id: new ObjectId(req.body.id),
    },
    {
      $set: { text: safeText },
      function() {
        // send back response to the browser
        res.send("Success");
      },
    }
  );
  // Parameter a) Document you want to update. b) set which fields you want to update on the element, c) function to get called once this database action has had a chance to complete
  // But first: Need to retrieve the ID of the item from the MongoDB Database

  // Preform CRUD operation on these documents
});

app.post("/delete-item", function (req, res) {
  // Parameters: a) The document to delete, b) function to run
  db.collection("items").deleteOne(
    {
      // MongoDB requires new ObjectId() [Tool from the MongoDB Package -> Import it]
      _id: new ObjectId(req.body.id),
    },
    function () {
      res.send("Success");
    }
  );
});
