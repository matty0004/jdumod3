const fs = require("fs");
const axios = require("axios");

function initroute(app) {
  var ubiwsurl = "https://public-ubiservices.ubi.com";
  var prodwsurl = "https://jmcs-prod.just-dance.com";


  app.get("/profile/v2/profiles", async (req, res) => {
    try {
      var profileid = req.url.split("=").pop();
      var ticket = req.header("Authorization");
      var SkuId = req.header("X-SkuId");
      var response = await axios.get(
        prodwsurl + "/profile/v2/profiles?profileIds=" + profileid,
        {
          headers: {
            "X-SkuId": SkuId,
            Authorization: ticket,
          },
        }
      );
      res.send(response.data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.post("/profile/v2/profiles", async (req, res) => {
    try {
      var ticket = req.header("Authorization");
      var SkuId = req.header("X-SkuId");
      var response = await axios.post(prodwsurl + "/profile/v2/profiles", req.body, {
        headers: {
          "X-SkuId": SkuId,
          Authorization: ticket,
          "Content-Type": "application/json",
        },
      });
      res.send(response.data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.put("/profile/v2/favorites/maps/:MapName", async (req, res) => {
    try {
      var MapName = req.params.MapName;
      var ticket = req.header("Authorization");
      var SkuId = req.header("X-SkuId");
      var response = await axios.put(
        prodwsurl + "/profile/v2/favorites/maps/" + MapName,
        null,
        {
          headers: {
            "X-SkuId": SkuId,
            Authorization: ticket,
          },
        }
      );
      res.send(response.data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.delete("/profile/v2/favorites/maps/:MapName", async (req, res) => {
    try {
      var MapName = req.params.MapName;
      var ticket = req.header("Authorization");
      var SkuId = req.header("X-SkuId");
      var response = await axios.delete(
        prodwsurl + "/profile/v2/favorites/maps/" + MapName,
        {
          headers: {
            "X-SkuId": SkuId,
            Authorization: ticket,
          },
        }
      );
      res.send(response.data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.get("/v3/profiles/sessions", async (req, res) => {
    try {
      var ticket = req.header("Authorization");
      var appid = req.header("Ubi-AppId");
      var response = await axios.get(ubiwsurl + "/v3/profiles/sessions", {
        headers: {
          "Content-Type": "application/json",
          "Ubi-AppId": appid,
          Authorization: ticket,
        },
      });
      res.send(response.data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.post("/profile/*/filter-players", async (req, res) => {
    try {
      var response = await axios.post(
        prodwsurl + "/profile/v2/filter-players",
        req.body,
        {
          headers: {
            "X-SkuId": req.header("X-SkuId"),
            Authorization: req.header("Authorization"),
            "Content-Type": "application/json",
          },
        }
      );
      res.send(response.data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.post("/v3/*", (request, response) => {
    response.redirect(prodwsurl + request.url);
  });

  app.delete("/v3/*", (request, response) => {
    response.redirect(prodwsurl + request.url);
  });

  app.get("/v3/*", (request, response) => {
    response.redirect(prodwsurl + request.url);
  });

  app.post("/v3/users/:user", (request, response) => {
    response.send();
  });
}

module.exports = { initroute };
