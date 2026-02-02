import express from "express";

const PORT = 3000;
const app = express();

app.get("/test", (req, res) => {
  res.json({ message: "hola mundo" });
});

app.listen(PORT, () => {
  console.log(`server started in port ${PORT}`);
});
