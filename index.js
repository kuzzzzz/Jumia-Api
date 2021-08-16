const express = require("express");
const app = express();
const getDrinks = require("./scrapper");
const searchJumia = require("./scrapper-search");
const productDescription = require("./scrapper-product-details");
const productReview = require("./scrapper-reviews");
const topSelling = require("./scrapper-top-selling");

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/dailyDeals", async (req, res) => {
  try {
    const { "mlp-deals-of-the-day": dailyDeals } = await getDrinks(
      "mlp-deals-of-the-day",
      1
    );
    return res.status(200).json({ dailyDeals });
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
    const drinks = await productDescription(`/${req.params.prodUrl}`);
    return res.status(200).json(drinks);
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

app.get(`/api/search/:category/:id`, async (req, res) => {
  try {
    const drinks = await searchJumia(req.params.category, req.params.id);
    return res.status(200).json(drinks);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});
app.get(`/api/category/:category`, async (req, res) => {
  try {
    const drinks = await getDrinks(req.params.category, 1);
    return res.status(200).json(drinks);
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.get(`/api/category/:category/:id`, async (req, res) => {
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
