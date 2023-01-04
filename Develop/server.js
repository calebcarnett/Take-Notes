const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);

const readFromFile = util.promisify(fs.readFile);

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)))
});


app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // // Destructuring assignment for the items in req.body
  const { title, text } = req.body;
console.log('the body', req.body);

  // // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text
    };

  const data = JSON.parse(fs.readFileSync('./db/notes.json', "utf8"))

  data.push(newNote);

 fs.writeFileSync('./db/notes.json', JSON.stringify(data))
  res.status(201).json(data);
  
} else {
  res.status(500).json('Error in posting review');
}
});


app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT} 🚀`)
})
