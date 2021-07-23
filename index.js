const express = require("express");
const path = require("path");
const app = express();
const getDrinks = require("./scrapper");

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const drinks = await getDrinks("mlp-deals-of-the-day", 1);
    return res.status(200).json(drinks);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.get(`/api/:category`, async (req, res) => {
  try {
    const drinks = await getDrinks(req.params.category,1);
    return res.status(200).json(drinks);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.get(`/api/:category/:id`, async (req, res) => {
  try {
    const drinks = await getDrinks(req.params.category, req.params.id);
    return res.status(200).json(drinks);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
      
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
