const axios = require("axios");
const cheerio = require("cheerio");

const productDescription = async (url) => {
  const productDetails = {
    sellerInformation: {},
    sellerPerformance: [],
    fullDescription: "",
    keyFeatures: [],
    specification: [],
    images: [],
    videos: [],
  };
  try {
    const siteUrl = `https://www.jumia.com.ng${url}`;
    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });
    const $ = cheerio.load(data);
    const elemSelector = "#jm > main > div > div.col4 > div.-pts > section";

    const decSel = "#jm > main > div > div.col12 > div.card.aim.-mtm";

    const specK =
      " #jm > main > div > div.col12 > section.card.aim.-mtm.-fs16 > div.row.-pas";
    const prodImg = "#imgs-crsl > div > div > label > img";

    // seller information
    productDetails.sellerInformation.name = $(
      "p.-m",
      $(elemSelector).html()
    ).text();
    productDetails.sellerInformation.sellerScore = $(
      "bdo.-m",
      $(elemSelector).html()
    ).text();
    productDetails.sellerInformation.followers = $(
      "p[data-followers] span.-m",
      $(elemSelector).html()
    ).text();

    // seller perfomance
    $("div.-i-ctr p", $(elemSelector)).each((p, r) => {
      productDetails.sellerPerformance.push($(r).text());
    });

    // Product desc
    productDetails.fullDescription = $("div.markup", $(decSel)).text();

    // Product images or videos
    productDetails.images[0] = $("img", $(decSel)).attr()
      ? $("img", $(decSel)).attr().src
      : "";
    productDetails.videos[0] = $("iframe", $(decSel)).attr()
      ? $("iframe", $(decSel)).attr().src
      : "";

    // product key features
    $("div.markup.-pam ul li", $(specK)).each((p, r) => {
      productDetails.keyFeatures.push($(r).text());
    });

    // product specifications
    $("ul.-pvs li", $(specK)).each((p, r) => {
      productDetails.specification.push($(r).text());
    });

    // More Images
    $(prodImg).each((p, r) => {
      productDetails.images.push($(r).attr()["data-src"]);
    });
    return productDetails;
  } catch (err) {
    console.error(err);
  }
};

module.exports = productDescription;
