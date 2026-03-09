const express = require("express");
const { errorHandler } = require("./errorHandler");
const app = express();
app.use(express.json());
app.post("/test", (req, res) => res.json({ ok: true }));
app.use(errorHandler);
app.listen(3002, () => console.log("started"));
