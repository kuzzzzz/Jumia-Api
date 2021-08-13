const express = require("express");
const app = express();
const getDrinks = require("./scrapper");
const productDescription = require("./scrapper-product-details");
const topSelling = require("./scrapper-top-selling");

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/dailyDeals", async (req, res) => {
  try {
    const drinks = await getDrinks("mlp-deals-of-the-day", 1);
    return res.status(200).json(drinks);
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

app.get(`/api/:category`, async (req, res) => {
  try {
    const drinks = await getDrinks(req.params.category, 1);
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
