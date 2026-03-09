const { check, validationResult } = require("express-validator");
const express = require("express");
const app = express();
app.use(express.json());
app.post("/", [check("salary").isNumeric()], (req, res) => {
    const errors = validationResult(req);
    res.json(errors.array());
});
app.listen(3001, () => console.log("started"));
