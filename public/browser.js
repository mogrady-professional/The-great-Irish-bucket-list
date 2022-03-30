// alert("Hello from the browser.js");
// Pass in e ; for event
function itemTemplate(item) {
    return `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>
  `;
}
let createField = document.getElementById("create-field");

// Initial Page Load Render
let ourHTML = items
    .map(function(item) {
        return itemTemplate(item);
    })
    .join(" ");

document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML);

// Create Feature
document.getElementById("create-form").addEventListener("submit", function(e) {
    // Prevent event default behaviour of the web browser
    e.preventDefault();
    axios
        .post("/create-item", {
            text: createField.value,
        })
        .then(function(response) {
            // response is the servers response back to the browser
            // Create the HTML for a new Item
            // console.log("You have created a new item");
            // Parameters: a) insert into document beforeend, b) the text to add
            document
                .getElementById("item-list")
                .insertAdjacentHTML("beforeend", itemTemplate(response.data));
            createField.value = "";
            createField.focus();
        })
        .catch(function() {
            console.log("Please try again later");
        });
}); // Listen for form submit, carry out function

document.addEventListener("click", function(e) {
    // Delete Feature
    if (e.target.classList.contains("delete-me")) {
        // Popup to ask the user if they are really sure!
        if (confirm("Do you really want to delete this item permanently?")) {
            // Send request to node server here using axios
            // Don't forget to set up the node server to listen to this request
            axios
                .post("/delete-item", {
                    id: e.target.getAttribute("data-id"),
                })
                .then(function() {
                    // Do something interesting here
                    // This code block runs after the post method has been successful and has a chance to complete
                    // Update the user interface once the action is complete
                    e.target.parentElement.parentElement.remove();
                })
                .catch(function() {
                    console.log("Please try again later");
                });
        }
    }

    // Update Feature
    // target contains all kinds of information about the event
    if (e.target.classList.contains("edit-me")) {
        // Only if the HTML element that gets clicked on has a class called "edit-me"
        // console.log("You clicked the edit button!");
        // Create prompt and save what the user types in to a vaariable
        // You can include a second argument that will be prepopulated into the prompt
        let userInput = prompt(
            "Enter your desired new text:",
            e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
        );

        // console.log(userInput); // Web browsers console not the server console!
        // As long as the userInput is NOT BLANK ( Check-> from the prompt)
        if (userInput) {
            // Send on the fly POST request to the server
            // Parameters: a) URL we want to send the POST request to. b) JavaScript Object which is the data that will be sent along with the request to that URL.
            axios
                .post("/update-item", {
                    text: userInput,
                    id: e.target.getAttribute("data-id"),
                })
                .then(function() {
                    // Do something interesting here
                    // This code block runs after the post method has been successful and has a chance to complete
                    // Update the user interface once the action is complete
                    e.target.parentElement.parentElement.querySelector(
                        ".item-text"
                    ).innerHTML = userInput;
                })
                .catch(function() {
                    console.log("Please try again later");
                });
        }
    }
});