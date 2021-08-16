const axios = require("axios");
const cheerio = require("cheerio");

const topSelling = async () => {
  const apiData = {
    topSelling: [
      {
        id: "",
        name: "",
        brand: "",
        productUrl: "",
        category: [],
        prices: "",
        imageSrc: [],
      },
    ],
  };
  try {
    const siteUrl = `https://www.jumia.com.ng`;
    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });
    const $ = cheerio.load(data);
    const elemSelector =
      "#jm > main > div.row.-pvm > div.col16.-mvs > div > section > div > div > div > article > a ";

    $(elemSelector).each((parentIdx, parentElem) => {
      let price = [];
      if ($("div.prc", $(parentElem).html()).data().oprc !== undefined) {
        price.push($("div.prc", $(parentElem).html()).data().oprc);
      }
      price.push($("div.prc", $(parentElem).html()).text());

      apiData.topSelling[parentIdx] = {
        id: parentElem.attribs["data-id"],
        name: $("div.name", $(parentElem).html()).text(),
        brand: parentElem.attribs["data-brand"],
        productUrl: parentElem.attribs["href"],
        category: parentElem.attribs["data-category"],
        prices: price,
        imageSrc: parentElem.firstChild.attribs["data-src"],
        prodDesc: `http://localhost:5000/api/prodDesc${parentElem.attribs["href"]}`,
        prodReview: `http://localhost:5000/api/reviews/${parentElem.attribs["data-id"]}/1`,
      };
    });
    let c = apiData.topSelling.length;
    apiData.topSelling.push({ totalProductsFound: c });
    return apiData;
  } catch (err) {
    console.error(err);
  }
};
module.exports = topSelling;
