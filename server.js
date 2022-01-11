const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const parser = require("body-parser");
const cors = require("cors");
const app = express();
const _ = require("lodash");
const axios = require("axios");
const port = process.env.PORT || 7000;
var info = {
  college: "",
  url: "",
  country: "",
  scraperUrl: "",
};

var coordinates = [];

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.send("Nine Tails Backend - Node Server Running");
});

app.post("/", function (req, response) {
  // console.log(req.body);
  info.college = req.body.college;
  info.url = req.body.url;
  info.country = req.body.country;
  if (req.body.scraperUrl === undefined) {
    info.scraperUrl = " ";
  } else {
    info.scraperUrl = req.body.scraperUrl;
  }

  console.log(info);

  request(info.scraperUrl, (err, res, html) => {
    if (!err && res.statusCode === 200) {
      const $ = cheerio.load(html);
      const title = $("h1.title");
      const location = $(
        "#Campus > div > div > div:nth-child(1) > p.subTitle.mt-4 > span"
      );
      const cost = $(
        "#Cost > div > div.flex.flex-col.space-y-4.lg\\:space-y-0.lg\\:flex-row.lg\\:justify-between.mt-4 > div > p"
      );

      const avg_living = $(
        "#Cost > div > div.flex.flex-col.lg\\:flex-row.justify-between.mt-4.lg\\:mt-6 > div:nth-child(2) > p.statsData.text-customGreen.mt-4.lg\\:mt-0"
      );
      const about = $("#About");
      const qsRank = $(
        "#Rankings > div > div.flex.flex-col.space-y-4.lg\\:space-y-0.lg\\:flex-row.lg\\:justify-between.mt-4 > div:nth-child(1) > p"
      );
      const qsLogo =
        "https://static.yocket.in/images/dashboard/ranking+logos/us-news-logo.jpeg";
      const wur = $(
        "#Rankings > div > div.flex.flex-col.space-y-4.lg\\:space-y-0.lg\\:flex-row.lg\\:justify-between.mt-4 > div:nth-child(2) > p"
      );
      const wurLogo =
        "https://static.yocket.in/images/dashboard/ranking+logos/qs-rankings-logo.jpeg";
      // console.log(title.html());
      // console.log(location.text());
      // console.log(cost.html());
      // console.log(avgB.html());
      // console.log(avgM.html());
      // console.log(about.text());
      // console.log(qsRank.html());
      // console.log(qsLogo);
      // console.log(wur.html());
      // console.log(wurLogo);

      const sendOffObject = {
        title:
          title.html() === null
            ? "NA"
            : title.html().replace(/\s+/g, " ").trim(),
        location: location.text() === null ? "" : location.text(),
        cost:
          cost.html() === null ? "NA" : cost.html().replace(/\s+/g, " ").trim(),

        avg_living:
          avg_living.html() === null
            ? "NA"
            : avg_living.html().replace(/\s+/g, " ").trim(),
        about: about.text() === null ? "" : about.text(),
        qsRank:
          qsRank.html() === null
            ? "NA"
            : qsRank.html().replace(/\s+/g, " ").trim(),
        qsLogo: qsLogo,
        wur:
          wur.html() === null ? "NA" : wur.html().replace(/\s+/g, " ").trim(),
        wurLogo: wurLogo,
      };

      console.log(sendOffObject);

      response.json(sendOffObject);
    }
  });
});

// app.post("/get-coordinates", (req,res)=>{
//   console.log(req.body.address);
//   axios.get("https://api.mapbox.com/geocoding/v5/mapbox.places/"+req.body.address+".json?access_token=pk.eyJ1IjoiYWRpdHlhdGhha2FyIiwiYSI6ImNrd2thZzBzbDFxaHQycW5zdTFjNWpra3YifQ.ceU-3_9E_vJ2xv4gQTSm8A").then(res=>{
//     console.log(res.data.features[0].geometry.coordinates);
//     coordinates=res.data.features[0].geometry.coordinates;
//
//   });
//
//   res.json(coordinates)
//
//
//
//
//
// });

app.listen(port, function (req, res) {
  console.log(`Server started on port 7000`);
});
