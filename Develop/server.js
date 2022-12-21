const express = require('express')
const app = express()
const port = ('/public/notes.html')

app.get('/public/notes.html', (req, res) => {
  res.send('heo')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})