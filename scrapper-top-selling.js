const axios = require("axios");
const cheerio = require("cheerio");
const productDescription = require("./scrapper-product-details");

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
        productDesc: {},
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
        // productDesc:productDescription
      };
    });
    let c = apiData.topSelling.length;
    apiData.topSelling.push({ totalProductsFound: c });

    // for (let x = 0; x < 28; x++) {
    //   let lofi = await productDescription(apiData.topSelling[x].productUrl);
    //   console.log(lofi)
    //   // apiData.topSelling[x].productDesc = lofi;
    // }
// productDescription()
    return apiData;
  } catch (err) {
    console.error(err);
  }
};

module.exports = topSelling;
