const express = require("express");
const app = express();
const getDrinks = require("./scrapper");
const searchJumia = require("./scrapper-search");
const productDescription = require("./scrapper-product-details");
const productReview = require("./scrapper-reviews");
const topSelling = require("./scrapper-top-selling");

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(express.static(__dirname + "/public"));

app.get("/", async (req, res) => {
  try {
    return res.sendFile("./views/index.html", { root: __dirname });
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.get("/api/flashSales", async (req, res) => {
  try {
    const { "flash-sales": flashSales } = await getDrinks(
      "flash-sales",
      1
    );
    
    return res.status(200).json({ flashSales });
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.get("/api/flashSales/:id", async (req, res) => {
  try {
    const { "flash-sales": flashSales } = await getDrinks(
      "flash-sales",
      req.params.id
    );
    return res.status(200).json({ flashSales });
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.get("/api/topSelling", async (req, res) => {
  try {
    const data = await topSelling();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

//basically the order matters I just changed the order and it worked

app.get(`/api/prodDesc/:prodUrl/`, async (req, res) => {
  try {
    const data = await productDescription(`/${req.params.prodUrl}`);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.get(`/api/reviews/:id/`, async (req, res) => {
  try {
    const reviews = await productReview(req.params.id, 1);
    return res.status(200).json(reviews);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.get(`/api/reviews/:id/:idx`, async (req, res) => {
  try {
    const reviews = await productReview(req.params.id, req.params.idx);
    return res.status(200).json(reviews);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.get(`/api/search/:category/`, async (req, res) => {
  try {
    const data = await searchJumia(req.params.category, 1);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.get(`/api/search/:category/:id`, async (req, res) => {
  try {
    const data = await searchJumia(req.params.category, req.params.id);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.get(`/api/category/:category`, async (req, res) => {
  try {
    const data = await getDrinks(req.params.category, 1);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.get(`/api/category/:category/:id`, async (req, res) => {
  try {
    const data = await getDrinks(req.params.category, req.params.id);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
