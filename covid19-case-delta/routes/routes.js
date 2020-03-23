const path = require("path");
const router = require("express").Router();
const db = require("../model/index");

const axios = require("axios");

// this would really only need to be run once during deployment
router.get("/seed", function (req, res) {
  console.log("get route");
  axios.get("https://covid19-api.weedmark.systems/api/v1/stats?country=USA").then((response) => {
    console.log("axios fired");
    console.log(response.data.data.covid19Stats);
    db.USA.create(response.data.data.covid19Stats).then((response) => {
      console.log(response);
      res.json(response);
    })
  });
})

// update hourly, etc
router.get("/update", function (req, res) {
  axios.get("https://covid19-api.weedmark.systems/api/v1/stats?country=USA").then((response) => {
    console.log("axios fired");
    let data = response.data.data.covid19Stats
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].province);
      db.USA.findOneAndUpdate(
        { province: data[i].province },
        { $push: { lastUpdate: data[i].lastUpdate, confirmed: data[i].confirmed, deaths: data[i].deaths, recovered: data[i].recovered } }
      ).then((response) => {
        console.log(response);
      })
    }
  });
})

// If no API routes are hit, send the React app

router.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/public/index.html"));
});

module.exports = router;