const { getChartData, getCoinInfo, getCoinPage } = require("../api");

module.exports = (app) => {
  app.get("/", (req, res) => {
    // TODO: send react app from build folder
    res.send("test");
  });
  app.get("/coin-info", async (req, res) => {
    const { coin } = req.query;
    const data = await getCoinInfo(coin);
    return res.json(data);
  });
  app.get("/coin-chart", async (req, res) => {
    const { coin, days } = req.query;
    const data = await getChartData(coin, days);
    return res.json(data);
  });
  app.get("/coin-list", async (req, res) => {
    const { page, perPage } = req.query;
    const data = await getCoinPage(page, perPage);
    return res.json(data);
  });
};
