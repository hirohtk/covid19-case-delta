const path = require("path");
const router = require("express").Router();
const db = require("../model/index");
const request = require('supertest');

const axios = require("axios");

// this would really only need to be run once during deployment
router.get("/seed", function (req, res) {
  console.log("get route");
  axios.get("https://covid19-api.weedmark.systems/api/v1/stats?country=USA").then((response) => {
    console.log("axios fired");
    let data = response.data.data.covid19Stats
    db.USA.create(data).then((response) => {

      res.json(response);
    })
  });
})

// update hourly, etc
router.get("/update", function (req, res) {
  axios.get("https://covid19-api.weedmark.systems/api/v1/stats?country=USA").then((response) => {

    let data = response.data.data.covid19Stats

    for (let i = 0; i < data.length; i++) {

      db.USA.findOneAndUpdate(
        { province: data[i].province },
        { $push: { lastUpdate: data[i].lastUpdate, confirmed: data[i].confirmed, deaths: data[i].deaths, recovered: data[i].recovered } }
      ).then((response) => {
        console.log(response);
      })
    }
  });
})

setInterval(() => {
  request(router)
  .get('/update')
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
    console.log(`test done`)
  });
}, 10000);

let updater = () => {
  request(router)
  .get('/update')
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
    console.log(`test done`)
  });
}

// If no API routes are hit, send the React app

router.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/public/index.html"));
});

module.exports = router;