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
      <html lang="en">
      
      <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="description" content="" />
          <meta name="author" content="" />
          <title>The great Irish bucket list: 35 places you have to visit</title>
          <!-- Favicon-->
          <link rel="icon" type="image/x-icon" href="assets/img/favicon.ico" />
          <!-- Bootstrap icons-->
          <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" rel="stylesheet" type="text/css" />
          <!-- Google fonts-->
          <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic,700italic" rel="stylesheet" type="text/css" />
          <!-- Core theme CSS (includes Bootstrap)-->
          <link href="assets/css/styles.css" rel="stylesheet" />
      </head>
      
      <body>
          <!-- Navigation-->
          <nav class="navbar navbar-light bg-light static-top">
              <div class="container">
                  <a class="navbar-brand" href="#">☘️ The Great Irish Bucket List</a>
              </div>
          </nav>
          <!-- Masthead-->
          <header class="masthead">
              <div class="container position-relative">
                  <div class="row justify-content-center">
                      <div class="col-xl-6">
                          <div class="text-center text-white">
                              <!-- Page heading-->
                              <h1 class="mb-5">
                                  The Great Irish Bucket List: 35 places you have to visit!
                              </h1>
                          </div>
                      </div>
                  </div>
              </div>
          </header>
          <!-- Icons Grid-->
          <!-- Image Showcases-->
          <section class="showcase">
              <!-- Logic Goes Here -> Start -->
              <div class="container">
                  <h1 class="display-4 text-center py-1">Bucket List</h1>
                  <div class="jumbotron p-3 shadow-sm">
                      <form id="create-form" action="/create-item" method="POST">
                          <div class="d-flex align-items-center">
                              <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1" />
                              <button class="btn btn-primary">Add New Item</button>
                          </div>
                      </form>
                  </div>
      
                  <ul id="item-list" class="list-group pb-5"></ul>
                  <!-- join() method converts array into string of text -->
              </div>
              <!-- Logic Goes Here -> End -->
              <div class="container-fluid p-0">
                  <div class="row g-0">
                      <div class="col-lg-6 order-lg-2 text-white showcase-img" style="background-image: url('assets/img/doolough-valley-mayo.jpg')"></div>
                      <div class="col-lg-6 order-lg-1 my-auto showcase-text">
                          <h2>1. A Wild Atlantic Way road trip</h2>
                          <p class="lead mb-0">
                              People all over the world adore the Wild Atlantic Way, the legendary coastal 2,500km drive that runs from Donegal to Kinsale. Marvel at craggy cliff faces, roaring waves, and fiery red sunsets along this once in a lifetime journey.
                          </p>
                      </div>
                  </div>
                  <div class="row g-0">
                      <div class="col-lg-6 text-white showcase-img" style="
                    background-image: url('assets/img/header-cliffs-of-moher_clare.jpg');
                  "></div>
                      <div class="col-lg-6 my-auto showcase-text">
                          <h2>2. Stand on top of the Cliffs of Moher</h2>
                          <p class="lead mb-0">
                              You’ve looked at the photos, you’ve heard all the stories, but there’s nothing quite like standing on top of the iconic Cliffs of Moher for yourself. A trip to this special place in the heart of Clare is one of the best things to do in Ireland. You’ll
                              find the largest colony of puffins in Ireland on the Cliffs of Moher, visit and meet these adorable seabirds with their brightly coloured beaks.
                          </p>
                      </div>
                  </div>
                  <div class="row g-0">
                      <div class="col-lg-6 order-lg-2 text-white showcase-img" style="background-image: url('assets/img/header-skellig-michael-kerry.jpg"></div>
                      <div class="col-lg-6 order-lg-1 my-auto showcase-text">
                          <h2>3. Explore Skellig Michael</h2>
                          <p class="lead mb-0">
                              Featured in the recent Star Wars films, Skellig Michael in Kerry is one of the most spectacular places to go in Ireland. Steps carved into the steep rockface take you to a monastic settlement and beehive huts that date back to the sixth century. Landing
                              tours to this otherworldly island are an unforgettable experience and boat tours offer a remarkable view of Skellig Michael from the sea.
                          </p>
                      </div>
                  </div>
              </div>
          </section>
          <!-- Footer-->
          <footer class="footer bg-light">
              <div class="container">
                  <div class="row">
                      <div class="col-lg-6 h-100 text-center text-lg-start my-auto">
                          <ul class="list-inline mb-2">
                              <li class="list-inline-item"><a href="#!">About</a></li>
                              <li class="list-inline-item">⋅</li>
                              <li class="list-inline-item"><a href="#!">Contact</a></li>
                              <li class="list-inline-item">⋅</li>
                              <li class="list-inline-item"><a href="#!">Terms of Use</a></li>
                              <li class="list-inline-item">⋅</li>
                              <li class="list-inline-item"><a href="#!">Privacy Policy</a></li>
                          </ul>
                          <p class="text-muted small mb-4 mb-lg-0">
                              <a href="https://www.discoverireland.ie/irish-bucket-list">Content Provided by Discover Ireland</a>
                          </p>
                      </div>
                      <div class="col-lg-6 h-100 text-center text-lg-end my-auto">
                          <ul class="list-inline mb-0">
                              <li class="list-inline-item me-4">
                                  <a href="#!"><i class="bi-facebook fs-3"></i></a>
                              </li>
                              <li class="list-inline-item me-4">
                                  <a href="#!"><i class="bi-twitter fs-3"></i></a>
                              </li>
                              <li class="list-inline-item">
                                  <a href="#!"><i class="bi-instagram fs-3"></i></a>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          </footer>
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
