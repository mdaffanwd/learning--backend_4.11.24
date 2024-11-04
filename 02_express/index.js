import "dotenv/config";
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teaData = [];
let nextId = 1;

app.post("/teas", (req, res) => {
  logger.info("A post request is made to add a new tea");

  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

app.get("/teas/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  console.log(req.params.id);

  if (!tea) return res.status(404).send("Tea not found");
  res.status(200).send(tea);
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}...`);
});
