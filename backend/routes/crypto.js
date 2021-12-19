const {
  getChartData,
  getCoinInfo,
  getCoinPage,
  getMarketNews,
  getCryptoNews,
  getCoinNews,
} = require("../data/api");
const router = require("express").Router();

router.get("/coin-info", async (req, res) => {
  const { coin } = req.query;
  try {
    const data = await getCoinInfo(coin);
    return res.json(data);
  } catch (e) {
    return res.status(500);
  }
});

router.get("/coin-chart", async (req, res) => {
  const { coin, days } = req.query;
  try {
    const data = await getChartData(coin, days);
    return res.json(data);
  } catch (e) {
    return res.status(500);
  }
});

router.get("/coin-list", async (req, res) => {
  const { page, perPage } = req.query;
  try {
    const data = await getCoinPage(page, perPage);
    return res.json(data);
  } catch (e) {
    return res.status(500);
  }
});

router.get("/market-news", async (req, res) => {
  const { filter } = req.query;
  try {
    const data = await getMarketNews(filter);
    return res.json(data);
  } catch (e) {
    return res.status(500);
  }
});

router.get("/crypto-news", async (req, res) => {
  const { page, perPage } = req.query;
  try {
    const data = await getCryptoNews(page, perPage);
    return res.json(data);
  } catch (e) {
    return res.status(500);
  }
});

router.get("/coin-news", async (req, res) => {
  const { symbol } = req.query;
  try {
    const data = await getCoinNews(symbol);
    return res.json(data);
  } catch (e) {
    return res.status(500);
  }
});

module.exports = router;
