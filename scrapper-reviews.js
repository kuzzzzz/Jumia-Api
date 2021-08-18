const axios = require("axios");
const cheerio = require("cheerio");

const productReview = async (id, idx = 1) => {
  const productReview = {
    id: id,
    totalRating: "",
    avgStarRating: "",
    totalStarsRating: [],
    totalReviews: "",
    lastPage: "",
    currentPage: idx,
    reviews: [
      {
        author: "",
        date: "",
        rated: "",
        title: "",
        content: "",
        verifiedPurchase: false,
      },
    ],
  };
  try {
    const siteUrl = `https://www.jumia.com.ng/catalog/productratingsreviews/sku/${id}/?page=${idx}`;
    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });
    const $ = cheerio.load(data);
    const revSelector =
      "#jm > main > div > div > section > div.row.-fw-nw > div.cola.-phm.-df.-d-co";
    const ratingSelector =
      "#jm > main > div > div > section > div.row.-fw-nw > div.col4.-phm > div";
    const ratStarSelector =
      "#jm > main > div > div > section > div.row.-fw-nw > div.col4.-phm > ul > li";

    const lastPage =
      "  #jm > main > div > div > section > div.pg-w.-mhm.-ptl.-pbxl.-bt >  a[aria-label='Last Page']";
    let lastIndx = $(lastPage)["0"]
      ? $(lastPage)["0"].attribs["href"].split("=")
      : " ";
    lastIndx = lastIndx[lastIndx.length - 1];

    //last page
    productReview.lastPage = lastIndx;

    //total review
    let i = $("h2", $(revSelector)).text().split(" ");
    i = i[i.length - 1].replace(/[()]/g, "");
    productReview.totalReviews = i;

    //product review
    $("article", $(revSelector)).each((p, r) => {
      productReview.reviews[p] = {
        rated: $("div.stars", $(r)).text(),
        title: $("h3.-m", $(r)).text(),
        content: $("p.-pvs", $(r)).text(),
        author: $("span.-prs + span", $(r)).text(),
        date: $("span.-prs", $(r)).text(),
        verifiedPurchase: $("div.-gn5", $(r)).text() ? true : false,
      };
    });

    //rating summary

    productReview.totalRating = $("p.-fs16", $(ratingSelector))
      .text()
      .replace(/ratings|rating/gi, "")
      .trim();
    productReview.avgStarRating = $("span.-b", $(ratingSelector)).text();

    //  stars rating
    $(ratStarSelector).each((p, r) => {
      productReview.totalStarsRating.push($(r).text());
    });

    // if there are no reveiws
    if (Boolean(productReview.totalRating)) {
      return productReview;
    } else {
      return { message: $("p.-fs16.-ptl.-m").text() };
    }
  } catch (err) {
    return { message: err.message };
  }
};

// SE955EA08778FNAFAMZ;
// FA203FS1C0YPYNAFAMZ;
// LA721EA0X4E0VNAFAMZ;
// GA946EA04X4N3NAFAMZ;
// productReview("GA946EA04X4N3NAFAMZ", 1);
module.exports = productReview;
