const path = require("path");
const router = require("express").Router();
const db = require("../model/USA");

const axios = require("axios");

router.get("/", function (req, res) {
    axios.get("https://covid19-api.weedmark.systems/api/v1/stats?country=USA").then((response) => {
        console.log(response);
        db.create(response).then((response) => {
            res.json(response);
        })
  });
})

// If no API routes are hit, send the React app

router.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/public/index.html"));
});

module.exports = router;