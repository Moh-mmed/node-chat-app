const express = require('express')

const app = express()


app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = 5050;
app.listen(port, () => {
    console.log(`The App is running on port ${port}`)
})