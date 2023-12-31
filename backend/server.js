const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const taskRoute = require("./routers/task")
const cors = require("cors");



const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// Step 1:
dotenv.config();
// Step 2:
app.use(express.json());

// Step 3:
app.use(express.static("public"));
app.use("/upload",express.static("upload"));

// Step 4:
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);



const PORT = process.env.PORT || 5500;

app.use("/api/",taskRoute);


app.get("/",(req,res)=>{
  res.sendFile(__dirname + "/public/taskmanage.html")
})


app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
