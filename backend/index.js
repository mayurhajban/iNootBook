const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')


connectToMongo();
const app = express()
const port = 5000;

app.use(cors())
app.use(express.json())

//Creating routes
app.get('/', (req, res) => {
  res.send("This is local host 3000")
})
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNoteBook backend is Listening at port : https://localhost:${port}`)
})

