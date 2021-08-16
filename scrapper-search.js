const axios = require("axios");
const cheerio = require("cheerio");

const fs = require("fs");

const searchJumia = async (category, url) => {
  const apiData = {
    [category]: [
      {
        id: "",
        indexOnPage: "",
        name: "",
        numReviews: "",
        rating: "",
        brand: "",
        productUrl: "",
        category: [],
        prices: "",
        imageSrc: [],
      },
    ],
  };
  try {
    const siteUrl = `https://www.jumia.com.ng/catalog/?q=${category}&page=${url}#catalog-listinge`;
    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });
    const $ = cheerio.load(data);
    const elemSelector =
      "#jm > main > div.aim.row.-pbm > div.-pvs.col12 > section > div.-paxs.row._no-g._4cl-3cm-shs > article > a";
    const proSelc =
      "#jm > main > div.aim.row.-pbm > div.-pvs.col12 > section > header > div.-phs.-mh-48px.-df.-j-bet.-i-ctr.-bb > p";
    const lastpage =
      "#jm > main > div.aim.row.-pbm > div.-pvs.col12 > section > div.pg-w.-ptm.-pbxl > a[aria-label='Last Page']";

    let test = $(proSelc).text();
    test = test.split(" ")[0];
    let lastIndx = $(lastpage)["0"].attribs["href"];
    lastIndx = lastIndx.match(/[0-9]/g).join("");

    $(elemSelector).each((parentIdx, parentElem) => {
      if (parentElem.attribs["data-id"]) {
        let numReviews = $("div.rev", $(parentElem).html()).text();
        numReviews = numReviews.split(" ");
        numReviews = numReviews[numReviews.length - 1].substr(1);
        numReviews = numReviews.replace(/[()]/g, "");

        let prices = [];
        prices.push($("div.prc", $(parentElem).html()).text()),
          prices.push($("div.old", $(parentElem).html()).text()),
          (apiData[category][parentIdx] = {
            id: parentElem.attribs["data-id"],
            indexOnPage: `Page ${url}, product index ${parentElem.attribs["data-position"]}`,
            name: $("h3.name", $(parentElem).html()).text(),
            numReviews: numReviews,
            rating: $("div.rev div", $(parentElem).html()).text(),
            brand: parentElem.attribs["data-brand"],
            productUrl: parentElem.attribs["href"],
            category: parentElem.attribs["data-category"],
            prices: prices,
            imageSrc: parentElem.firstChild.firstChild.attribs["data-src"],
            prodDesc: `http://localhost:5000/api/prodDesc${parentElem.attribs["href"]}`,
            prodReview: `http://localhost:5000/api/reviews/${parentElem.attribs["data-id"]}/1`,
          });
      }
    });
    apiData[category].push({
      totalProductsFound: test,
      lastPage: lastIndx,
    });
    return apiData;
  } catch (err) {
    console.error(err);
  }
};

const final = async (t, v) => {
  const f = await searchJumia(t, v);
  // console.log(f);
  return f;
};

module.exports = searchJumia;

// To do rountinely save data to file
// const saveData = async () => {
//   for (let i = 1; i <= 27; ++i) {
//     const data = await getDrinks(i);
//     fs.appendFileSync("jumia-drinks.json", JSON.stringify(data));
//   }
// };

// saveData();

// Task
// Reviews scrapper
// code clean up
// error handling
// adding mongo database
// post routes
// open source