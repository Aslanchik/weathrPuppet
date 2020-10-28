const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const apiRoute = require("./routes/api");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/", apiRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Conncted on port ${PORT}`));
