const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const PORT = 3001;
// Helper method for generating unique ids
const uuid = require("./helper/uuid");

const app = express();
// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);
// GET Route for notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

// GET Route for retrieving all notes
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile("./db/notes.json").then((data) => res.json(JSON.parse(data)));
});

// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
// POST Route for a new notes
app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring for the items in req.body
  const { title, text } = req.body;
  console.log("the body", req.body);

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    //converted notes.json into an object and assigned a data constant
    const data = JSON.parse(fs.readFileSync("./db/notes.json", "utf8"));
    //pushed the newly added note to notes.json file
    data.push(newNote);
    //writes to file notes.json, stringify changes the data in the object to a string
    fs.writeFileSync("./db/notes.json", JSON.stringify(data));
    res.status(201).json(data);
  } else {
    res.status(500).json("Error in posting review");
  }
});

app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT} 🚀`);
});
